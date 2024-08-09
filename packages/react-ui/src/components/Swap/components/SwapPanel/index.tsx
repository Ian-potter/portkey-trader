import { useCallback, useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { useEffectOnce } from 'react-use';
import clsx from 'clsx';
import InputContainer from '../InputRow';
import CommonSvg from '../../../CommonSvg';
import CommonButton from '../../../CommonButton';
import { CircleProcess, CircleProcessInterface } from '../../../CircleProcess';
import { isValidNumber } from '../../../../utils/reg';
import { SWAP_TIME_INTERVAL, ZERO } from '../../../../constants/misc';
import './index.less';
import SwapTipsModal from '../SwapTipsModal';
import SwapSettingsModal from '../SwapSettingsModal';
import { SwapConfirmModal } from '../SwapConfirmModal';
import { useAwakenSwapContext } from '../../../../context/AwakenSwap';
import SelectTokenModal from '../SelectTokenModal';
import { swapActions } from '../../../../context/AwakenSwap/actions';
import { useGetTokenPrice } from '../../../../hooks/price';
import { ChainId, TTokenItem } from '../../../../types';
import {
  bigNumberToString,
  getPriceImpactWithBuy,
  minimumAmountOut,
  parseUserSlippageTolerance,
} from '../../../../utils/swap';
import { RouteType } from '@portkey/trader-services';
import { divDecimals, formatSymbol, formatPrice, timesDecimals, ONE, sleep } from '@portkey/trader-utils';
import CommonTooltip from '../../../CommonTooltip';
import { TSwapRoute } from '../../types';
import BigNumber from 'bignumber.js';
import { CurrencyLogos } from '../../../CurrencyLogo';
import { getBalance } from '../../../../utils/getBalance';
import { useTokenList } from '../../../../hooks/tokenList';
import { SwapOrderRoutingModal } from '../SwapOrderRouting/SwapOrderRoutingModal';
import { useDebounceCallback } from '../../../../hooks';
import { DEFAULT_SLIPPAGE_TOLERANCE, STORAGE_SLIPPAGE_TOLERANCE_KEY } from '../../../../constants/swap';
import Font from '../../../../components/Font';
import { SwapOrderRouting } from '../SwapOrderRouting';
import { TSwapToken } from '@portkey/trader-core';

export interface ISwapPanel {
  wrapClassName?: string;
  selectTokenInSymbol?: string;
  selectTokenOutSymbol?: string;
  onConfirmSwap?: () => void;
}

export type TSwapInfo = {
  tokenIn?: TTokenItem;
  tokenOut?: TTokenItem;

  valueIn: string;
  valueOut: string;
};

export enum BtnErrEnum {
  'error' = 'error',
  'none' = 'none',
  'tip' = 'tip',
}

export interface IValueInfo {
  tokenIn: TTokenItem | undefined;
  tokenOut: TTokenItem | undefined;
  valueIn: string;
  valueOut: string;
}

export default function SwapPanel({
  wrapClassName,
  selectTokenInSymbol,
  selectTokenOutSymbol,
  onConfirmSwap,
}: ISwapPanel) {
  const allTokens = useTokenList();
  const [{ isMobile, awaken }, { dispatch }] = useAwakenSwapContext();
  const [extraPriceInfoShow, setExtraPriceInfoShow] = useState(false);
  const [valueInfo, setValueInfo] = useState<IValueInfo>({
    tokenIn: undefined,
    tokenOut: undefined,
    valueIn: '',
    valueOut: '',
  });

  const valueInfoRef = useRef(valueInfo);
  valueInfoRef.current = valueInfo;
  const [swapRoute, setSwapRoute] = useState<TSwapRoute>();
  const [swapTokens, setSwapTokens] = useState<TSwapToken[]>();

  const circleProcessRef = useRef<CircleProcessInterface>();
  const [tokenInUsd, setTokenInUsd] = useState('');
  const [tokenOutUsd, setTokenOutUsd] = useState('');
  const [valueInBalance, setValueInBalance] = useState('');
  const [valueOutBalance, setValueOutBalance] = useState('');
  const [confirmBtnError, setConfirmBtnError] = useState<BtnErrEnum>(BtnErrEnum.none);
  const [opTokenIn, setOpTokenIn] = useState(false);
  const routeTypeRef = useRef<RouteType>(RouteType.AmountIn);
  const [isUnitConversionReverse, setIsUnitConversionReverse] = useState(false);
  const [gasFee, setGasFee] = useState(0);
  const getTokenPrice = useGetTokenPrice();
  const refreshTokenValueRef = useRef<typeof refreshTokenValue>();
  const timerRef = useRef<NodeJS.Timeout>();
  const [userSlippageTolerance, setUserSlippageTolerance] = useState(DEFAULT_SLIPPAGE_TOLERANCE);
  const timerFlagRef = useRef(false);
  const [owner, setOwner] = useState('');

  // init
  useLayoutEffect(() => {
    if (localStorage.getItem(STORAGE_SLIPPAGE_TOLERANCE_KEY))
      setUserSlippageTolerance(localStorage.getItem(STORAGE_SLIPPAGE_TOLERANCE_KEY) || DEFAULT_SLIPPAGE_TOLERANCE);
  }, []);

  useEffect(() => {
    awaken
      ?.getOptions?.()
      .then((res) => {
        setOwner(res?.address ?? '');
      })
      .catch((err) => {
        console.log('===awaken?.getOptions', err);
      });
  }, [awaken]);
  const executeCb = useCallback(async () => {
    const { tokenIn, tokenOut } = valueInfoRef.current;
    if (!tokenIn || !tokenOut) return;

    try {
      refreshTokenValueRef.current?.();
    } catch (error) {
      console.log('executeCb error', error);
    }
    return undefined;
  }, []);
  const executeCbRef = useRef(executeCb);
  executeCbRef.current = executeCb;
  useEffect(() => {
    if (allTokens.length) {
      let _tokenIn = valueInfo.tokenIn;
      let _tokenOut = valueInfo.tokenOut;
      if (selectTokenInSymbol) {
        _tokenIn = allTokens.find((item) => item.symbol === selectTokenInSymbol);
      }
      if (selectTokenOutSymbol) {
        _tokenOut = allTokens.find((item) => item.symbol === selectTokenOutSymbol);
      }
      setValueInfo((pre) => ({
        ...pre,
        tokenIn: _tokenIn,
        tokenOut: _tokenOut,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTokens, selectTokenInSymbol, selectTokenOutSymbol]);

  const slippageValue = useMemo(() => {
    return ZERO.plus(parseUserSlippageTolerance(userSlippageTolerance)).dp(2).toString();
  }, [userSlippageTolerance]);
  const amountOutMinValue = useMemo(() => {
    const { valueOut, tokenOut } = valueInfo;
    if (!valueOut || !tokenOut) return '-';
    const _value = bigNumberToString(minimumAmountOut(ZERO.plus(valueOut), userSlippageTolerance), tokenOut.decimals);
    return `${_value} ${formatSymbol(tokenOut.symbol)}`;
  }, [valueInfo, userSlippageTolerance]);
  const priceImpact = useMemo(() => {
    if (!swapRoute) return '-';

    const impactList: BigNumber[] = [];
    swapRoute.distributions.forEach((path) => {
      for (let i = 0; i < path.tokens.length - 1; i++) {
        const tradePairExtension = path.tradePairExtensions[i];
        const tokenIn = path.tokens[i];
        const tokenOut = path.tokens[i + 1];
        const tokenInReserve = ZERO.plus(tradePairExtension.valueLocked0);
        const tokenOutReserve = ZERO.plus(tradePairExtension.valueLocked1);
        const valueIn = divDecimals(path.amounts[i], tokenIn.decimals);
        const valueOut = divDecimals(path.amounts[i + 1], tokenOut.decimals);
        const _impact = getPriceImpactWithBuy(tokenOutReserve, tokenInReserve, valueIn, valueOut);
        impactList.push(_impact);
      }
    });

    return `${bigNumberToString(BigNumber.max(...impactList), 2)}%`;
  }, [swapRoute]);
  const swapFeeValue = useMemo(() => {
    const { tokenIn, valueIn } = valueInfo;

    if (!swapRoute || !tokenIn || !valueIn) return '-';

    let totalFee = ZERO;
    swapRoute.distributions.forEach((path) => {
      const { amountIn, feeRates } = path;
      const reserveRate = feeRates.reduce((p, c) => p.times(ONE.minus(c)), ONE);
      const totalFeeRate = ONE.minus(reserveRate);
      const feeAmount = ZERO.plus(amountIn).times(totalFeeRate);
      const fee = divDecimals(feeAmount, tokenIn.decimals).dp(tokenIn.decimals);
      totalFee = totalFee.plus(fee);
    });

    return `${totalFee.toFixed()} ${formatSymbol(tokenIn.symbol)}`;
  }, [swapRoute, valueInfo]);
  const gasFeeValue = useMemo(() => {
    return divDecimals(ZERO.plus(gasFee), 8);
  }, [gasFee]);

  const clearTimer = useCallback(() => {
    if (!timerRef.current) return;
    clearInterval(timerRef.current);
    timerRef.current = undefined;
    console.log('clearTimer');
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  const registerTimer = useCallback(() => {
    clearTimer();
    const { tokenIn, tokenOut } = valueInfoRef.current;
    if (!tokenIn || !tokenOut) return;

    executeCbRef.current();
    circleProcessRef.current?.start();
    timerRef.current = setInterval(() => {
      executeCbRef.current();
      circleProcessRef.current?.start();
    }, SWAP_TIME_INTERVAL);
  }, [clearTimer]);

  useEffect(() => {
    if (timerFlagRef.current) return;
    const { tokenIn, tokenOut } = valueInfo;
    if (!tokenIn || !tokenOut) return;
    timerFlagRef.current = true;
    registerTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueInfo]);

  useEffectOnce(() => {
    awaken?.instance
      ?.getTransactionFee()
      .then((res) => {
        setGasFee(res.transactionFee);
      })
      .catch((err) => {
        setGasFee(0);
        console.log('===getTransactionFee err', err);
      });
  });

  useEffect(() => {
    if (!valueInfo.tokenIn?.symbol) return;
    getTokenPrice({
      symbol: valueInfo.tokenIn.symbol,
      chainId: valueInfo.tokenIn.chainId as ChainId,
      tokenAddress: valueInfo.tokenIn.address,
    })
      .then((res) => {
        setTokenInUsd(res);
      })
      .catch((err) => {
        setTokenInUsd('');
        console.log('===getTokenPrice error', err);
      });
  }, [getTokenPrice, valueInfo.tokenIn]);

  useEffect(() => {
    if (!valueInfo.tokenOut?.symbol) return;
    getTokenPrice({
      symbol: valueInfo.tokenOut.symbol,
      chainId: valueInfo.tokenOut.chainId as ChainId,
      tokenAddress: valueInfo.tokenOut.address,
    })
      .then((res) => {
        setTokenOutUsd(res);
      })
      .catch((err) => {
        setTokenOutUsd('');
        console.log('===getTokenPrice error', err);
      });
  }, [getTokenPrice, valueInfo.tokenOut]);

  useEffect(() => {
    if (!(valueInfo.tokenIn?.symbol && owner)) {
      setValueInBalance('');
    } else {
      getBalance({ symbol: valueInfo.tokenIn.symbol, owner, awaken })
        .then((res) => {
          const _bal = divDecimals(res.balance, valueInfo.tokenIn?.decimals).toFixed();
          setValueInBalance(_bal);
        })
        .catch((err) => {
          setValueInBalance('');
          console.log('===getBalance error', err);
        });
    }
  }, [awaken, owner, valueInfo.tokenIn?.decimals, valueInfo.tokenIn?.symbol]);

  useEffect(() => {
    if (!(valueInfo.tokenOut?.symbol && owner)) {
      setValueOutBalance('');
    } else {
      getBalance({ symbol: valueInfo.tokenOut.symbol, owner, awaken })
        .then((res) => {
          const _bal = divDecimals(res.balance, valueInfo.tokenOut?.decimals).toFixed();
          setValueOutBalance(_bal);
        })
        .catch((err) => {
          setValueOutBalance('');
          console.log('===getBalance error', err);
        });
    }
  }, [owner, valueInfo.tokenIn, valueInfo.tokenOut, awaken]);

  const usdImpactInfo = useMemo(() => {
    const { tokenIn, tokenOut, valueIn, valueOut } = valueInfo;
    if (!tokenIn || !tokenOut || !valueIn || !valueOut) return undefined;

    if (
      !tokenInUsd ||
      tokenInUsd === '0' ||
      !tokenOutUsd ||
      tokenOutUsd === '0' ||
      ZERO.eq(valueIn) ||
      ZERO.eq(valueOut)
    )
      return;

    const priceIn = ZERO.plus(valueIn).times(tokenInUsd);
    const priceOut = ZERO.plus(valueOut).times(tokenOutUsd);
    const _impact = priceOut.minus(priceIn).div(priceIn).times(100).dp(2);
    let fontColor = '#00B75F';
    if (_impact.gt(ZERO)) {
      fontColor = '#00B75F';
    } else if (_impact.lt(ZERO)) {
      fontColor = '#B34B4B';
    }

    return {
      label: `${_impact.gt(ZERO) ? '+' : ''}${_impact.toFixed()}%`,
      fontColor,
    };
  }, [tokenInUsd, tokenOutUsd, valueInfo]);

  const refreshTokenValue = useCallback(async () => {
    if (!(valueInfo.tokenIn && valueInfo.tokenOut)) return;
    const params = {
      chainId: valueInfo.tokenIn.chainId,
      symbolIn: valueInfo.tokenIn.symbol,
      symbolOut: valueInfo.tokenOut.symbol,
      amountOut:
        routeTypeRef.current === RouteType.AmountIn
          ? undefined
          : timesDecimals(valueInfo.valueOut, valueInfo.tokenOut.decimals).toFixed(),
      amountIn:
        routeTypeRef.current === RouteType.AmountIn
          ? timesDecimals(valueInfo.valueIn, valueInfo.tokenIn.decimals).toFixed()
          : undefined,
    };
    const routerRes = await awaken?.instance?.getBestRouters(routeTypeRef.current as any, params as any);
    const bestRoute = routerRes?.bestRouters?.[0];
    setSwapRoute(bestRoute as any);
    setSwapTokens(routerRes?.swapTokens);
    const _amountIn = divDecimals(bestRoute?.amountIn, valueInfo.tokenIn?.decimals).toFixed();
    const _amountOut = divDecimals(bestRoute?.amountOut, valueInfo.tokenOut?.decimals).toFixed();
    setValueInfo((pre) => ({
      ...pre,
      valueIn: _amountIn,
      valueOut: _amountOut,
    }));
  }, [awaken?.instance, valueInfo.tokenIn, valueInfo.tokenOut, valueInfo.valueIn, valueInfo.valueOut]);

  refreshTokenValueRef.current = refreshTokenValue;
  const refreshTokenValueDebounce = useDebounceCallback(refreshTokenValue, [refreshTokenValue]);

  const switchToken = useCallback(async () => {
    if (!(valueInfo.tokenIn && valueInfo.tokenOut)) return;
    const lastOpIn = routeTypeRef.current === RouteType.AmountIn;
    setValueInfo((pre) => ({
      tokenIn: pre.tokenOut,
      tokenOut: pre.tokenIn,
      valueOut: lastOpIn ? pre.valueIn : '',
      valueIn: lastOpIn ? '' : pre.valueOut,
    }));
    const _preInBal = valueInBalance;
    const _preOutBal = valueOutBalance;
    setValueInBalance(_preOutBal);
    setValueOutBalance(_preInBal);
    routeTypeRef.current = lastOpIn ? RouteType.AmountOut : RouteType.AmountIn;
    refreshTokenValueDebounce();
    await sleep(100);
    registerTimer();
  }, [
    refreshTokenValueDebounce,
    registerTimer,
    valueInBalance,
    valueInfo.tokenIn,
    valueInfo.tokenOut,
    valueOutBalance,
  ]);
  const onValueInChange = useCallback(
    async (v: string) => {
      if (!v) {
        setValueInfo((pre) => ({
          ...pre,
          valueIn: '',
          valueOut: '',
        }));
        return;
      }
      if (v && !isValidNumber(v)) return;
      setValueInfo((pre) => ({
        ...pre,
        valueIn: v,
        valueOut: '',
      }));
      setOpTokenIn(true);
      routeTypeRef.current = RouteType.AmountIn;
      refreshTokenValueDebounce();
    },
    [refreshTokenValueDebounce],
  );
  const onValueOutChange = useCallback(
    async (v: string) => {
      if (!v) {
        setValueInfo((pre) => ({
          ...pre,
          valueIn: '',
          valueOut: '',
        }));
        return;
      }
      if (v && !isValidNumber(v)) return;
      setValueInfo({
        ...valueInfo,
        valueOut: v,
        valueIn: '',
      });
      setOpTokenIn(false);
      routeTypeRef.current = RouteType.AmountOut;
      refreshTokenValueDebounce();
    },
    [refreshTokenValueDebounce, valueInfo],
  );
  const onSelectTokenIn = useCallback(() => {
    setOpTokenIn(true);
    dispatch(swapActions.setSelectTokenModalShow.actions(true));
  }, [dispatch]);
  const onTokenInChange = useCallback(
    (token: TTokenItem | undefined) => {
      if (token?.symbol === valueInfo.tokenOut?.symbol) {
        switchToken();
      } else {
        setValueInfo((pre) => ({
          ...pre,
          tokenIn: token,
          valueIn: '',
        }));
        setOpTokenIn(false);
        routeTypeRef.current = RouteType.AmountOut;
        refreshTokenValueDebounce();
      }
    },
    [refreshTokenValueDebounce, switchToken, valueInfo.tokenOut?.symbol],
  );
  const onSelectTokenOut = useCallback(() => {
    setOpTokenIn(false);
    dispatch(swapActions.setSelectTokenModalShow.actions(true));
  }, [dispatch]);
  const onTokenOutChange = useCallback(
    (token: TTokenItem | undefined) => {
      if (token?.symbol === valueInfo.tokenIn?.symbol) {
        switchToken();
      } else {
        setValueInfo((pre) => ({
          ...pre,
          tokenOut: token,
          valueOut: '',
          valueIn: '',
        }));
        setOpTokenIn(true);
        routeTypeRef.current = RouteType.AmountIn;
        refreshTokenValueDebounce();
      }
    },
    [refreshTokenValueDebounce, switchToken, valueInfo.tokenIn?.symbol],
  );
  const onClickMax = useCallback(() => {
    if (!valueInBalance) return;
    if (!(valueInfo.tokenIn && valueInfo.tokenOut)) return;
    let _v = '0';
    if (valueInfo.tokenIn?.symbol === 'ELF' && gasFee && valueInBalance) {
      const _valueBN = ZERO.plus(timesDecimals(valueInBalance, valueInfo.tokenIn.decimals)).minus(gasFee);
      if (_valueBN.lte(ZERO)) {
        _v = '0';
      } else {
        _v = divDecimals(_valueBN, valueInfo.tokenIn?.decimals).toFixed();
      }
    } else {
      _v = valueInBalance;
    }
    setValueInfo((pre) => ({
      ...pre,
      valueIn: _v,
      valueOut: '',
    }));
    setOpTokenIn(true);
    routeTypeRef.current = RouteType.AmountIn;
    refreshTokenValueDebounce();
  }, [gasFee, refreshTokenValueDebounce, valueInBalance, valueInfo.tokenIn, valueInfo.tokenOut]);

  const unitConversionShow = useMemo(() => {
    const { tokenIn, tokenOut, valueIn, valueOut } = valueInfo;
    if (!tokenIn || !tokenOut) return '-';
    const symbolIn = formatSymbol(tokenIn.symbol);
    const symbolOut = formatSymbol(tokenOut.symbol);

    if (!isUnitConversionReverse) {
      if (!valueIn || !valueOut) return `1 ${symbolOut} = - ${symbolIn}`;

      const _price = formatPrice(ZERO.plus(valueIn).div(ZERO.plus(valueOut)));
      return `1 ${symbolOut} = ${_price} ${symbolIn}`;
    } else {
      if (!valueIn || !valueOut) return `1 ${symbolIn} = - ${symbolOut}`;

      const _price = formatPrice(ZERO.plus(valueOut).div(ZERO.plus(valueIn)));
      return `1 ${symbolIn} = ${_price} ${symbolOut}`;
    }
  }, [isUnitConversionReverse, valueInfo]);

  const fixedPriceInfoData = useMemo(() => {
    return [
      {
        label: 'Max. Slippage',
        value: (
          <div className="portkey-swap-row-center">
            <Font size={14} lineHeight={22} suffix="%">
              {slippageValue}
            </Font>
            <CommonSvg
              type="icon-edit"
              onClick={() => {
                dispatch(swapActions.setSettingModalShow.actions(true));
              }}
            />
          </div>
        ),
        tooltipMsg: `The trade will be cancelled when slippage exceeds this percentage.`,
      },
    ];
  }, [dispatch, slippageValue]);

  const extraPriceInfoData = useMemo(() => {
    return [
      {
        label: 'Min. Received',
        value: amountOutMinValue,
        tooltipMsg: `Min.Received refers to the exchange result at the price corresponding to the Max.Slippage you set.Generally, it will be more.`,
      },
      {
        label: 'Price Impact',
        value: priceImpact,
        tooltipMsg: `The maximum impact on the currency price of the liquidity pool after the transaction is completed.`,
      },
      {
        label: 'Swap Fee',
        value: swapFeeValue,
        tooltipMsg: `The accumulated fee share of this trading pair's positions.`,
      },
      {
        label: 'Network Cost',
        value: `${gasFeeValue} ELF`,
        tooltipMsg: `Network Cost are the miner fees paid in order for transactions to proceed.`,
      },
      {
        label: 'Order Routing',
        value: (
          <div className="portkey-swap-flex-row-center">
            {valueInfo.tokenIn && valueInfo.tokenOut && (
              <CurrencyLogos isSortToken={false} size={20} tokens={[valueInfo.tokenIn, valueInfo.tokenOut]} />
            )}
            {isMobile ? (
              <CommonSvg
                type="icon-arrow-up2"
                onClick={() => dispatch(swapActions.setOrderRoutingModalShow.actions(true))}
              />
            ) : (
              <CommonTooltip
                placement="topRight"
                overlayStyle={{ minWidth: '350px', maxWidth: '1000px' }}
                title={<SwapOrderRouting swapRoute={swapRoute} />}>
                <CommonSvg type="icon-arrow-up2" />
              </CommonTooltip>
            )}
          </div>
        ),
        tooltipMsg: `Awaken's order routing selects the swap path with the lowest comprehensive cost to complete the transaction and increase the amount you receive.`,
      },
    ];
  }, [
    amountOutMinValue,
    dispatch,
    gasFeeValue,
    isMobile,
    priceImpact,
    swapFeeValue,
    swapRoute,
    valueInfo.tokenIn,
    valueInfo.tokenOut,
  ]);

  const priceInfoDataShow = useMemo(() => {
    if (valueInfo.valueIn) {
      return [...fixedPriceInfoData, ...extraPriceInfoData];
    }
    return fixedPriceInfoData;
  }, [extraPriceInfoData, fixedPriceInfoData, valueInfo.valueIn]);

  const confirmBtnText = useMemo(() => {
    if (!(valueInfo.tokenIn && valueInfo.tokenOut)) {
      setConfirmBtnError(BtnErrEnum.tip);
      return `Select a token`;
    }
    if (!Number(valueInfo.valueIn)) {
      setConfirmBtnError(BtnErrEnum.tip);
      return `Enter an amount`;
    }
    if (!valueInBalance || ZERO.plus(valueInfo.valueIn).gt(valueInBalance)) {
      setConfirmBtnError(BtnErrEnum.error);
      return `Insufficient ${valueInfo.tokenIn.symbol} balance`;
    }
    setConfirmBtnError(BtnErrEnum.none);
    return `Swap`;
  }, [valueInBalance, valueInfo.tokenIn, valueInfo.tokenOut, valueInfo.valueIn]);

  const handleConfirmSwapSuccess = useCallback(() => {
    onConfirmSwap?.();
    if (allTokens.length) {
      let _tokenIn = valueInfo.tokenIn;
      let _tokenOut = valueInfo.tokenOut;
      if (selectTokenInSymbol) {
        _tokenIn = allTokens.find((item) => item.symbol === selectTokenInSymbol);
      }
      if (selectTokenOutSymbol) {
        _tokenOut = allTokens.find((item) => item.symbol === selectTokenOutSymbol);
      }
      setValueInfo({
        valueIn: '',
        valueOut: '',
        tokenIn: _tokenIn,
        tokenOut: _tokenOut,
      });
    }
  }, [allTokens, onConfirmSwap, selectTokenInSymbol, selectTokenOutSymbol, valueInfo.tokenIn, valueInfo.tokenOut]);

  return (
    <div className={clsx('swap-panel-wrapper', isMobile && 'swap-panel-wrapper-mobile', wrapClassName)}>
      <InputContainer
        title="Pay"
        value={valueInfo.valueIn}
        priceInUsd={tokenInUsd}
        balance={valueInBalance}
        tokenInfo={valueInfo.tokenIn}
        onInputChange={onValueInChange}
        onSelectToken={onSelectTokenIn}
        showMax
        inputDisabled={!(valueInfo.tokenIn && valueInfo.tokenOut)}
        onClickMax={onClickMax}
      />
      <div className="swap-token-switch-wrap">
        <div className="swap-token-switch-btn portkey-swap-flex-center" onClick={switchToken}>
          <CommonSvg type="icon-arrow-down3" className="swap-token-switch-btn-default" />
          <CommonSvg type="icon-price-switch" className="swap-token-switch-btn-hover" />
        </div>
      </div>
      <InputContainer
        title="Receive"
        value={valueInfo.valueOut}
        priceInUsd={tokenOutUsd}
        balance={valueOutBalance}
        tokenInfo={valueInfo.tokenOut}
        inputDisabled={!(valueInfo.tokenIn && valueInfo.tokenOut)}
        wrapClassName="below-input-container"
        onInputChange={onValueOutChange}
        onSelectToken={onSelectTokenOut}
        usdSuffix={<span style={{ color: usdImpactInfo?.fontColor }}>{usdImpactInfo?.label}</span>}
      />

      <div className={clsx('swap-btn-wrap')}>
        <CommonButton
          className={clsx(
            confirmBtnError === BtnErrEnum.error && 'btn-error',
            confirmBtnError === BtnErrEnum.tip && 'btn-tip',
          )}
          onClick={() => dispatch(swapActions.setConfirmModalShow.actions(true))}
          disabled={confirmBtnError !== BtnErrEnum.none}>
          {confirmBtnText}
        </CommonButton>
      </div>

      {unitConversionShow !== '-' && (
        <div className="swap-price-swap portkey-swap-flex-row-between">
          <div className="portkey-swap-flex-center">
            <div className="single-price-swap">{unitConversionShow}</div>
            <CommonSvg type="icon-price-switch" onClick={() => setIsUnitConversionReverse((pre) => !pre)} />
            <CircleProcess ref={circleProcessRef} />
          </div>
          <CommonSvg
            type="icon-arrow-up2"
            onClick={() => setExtraPriceInfoShow((pre) => !pre)}
            className={clsx('portkey-swap-row-center', !extraPriceInfoShow && 'rotate-icon')}
          />
        </div>
      )}

      {extraPriceInfoShow && (
        <div className="swap-price-swap-info portkey-swap-flex-column">
          {priceInfoDataShow.map((info, index: number) => (
            <div key={index} className="portkey-swap-flex-row-between price-swap-info-item">
              <div className="portkey-swap-flex-row-center">
                <span className="price-swap-info-label">{info.label}</span>
                {isMobile ? (
                  <CommonSvg
                    type="icon-question"
                    onClick={() => {
                      dispatch(
                        swapActions.setTipsModalInfo.actions({
                          title: info.label,
                          content: info.tooltipMsg,
                        }),
                      );
                      dispatch(swapActions.setTipsModalShow.actions(true));
                    }}
                  />
                ) : (
                  <CommonTooltip placement="topLeft" title={info.tooltipMsg} getPopupContainer={(v) => v} />
                )}
              </div>
              <div className="price-swap-info-value">{info.value}</div>
            </div>
          ))}
        </div>
      )}

      <SwapOrderRoutingModal swapRoute={swapRoute} />
      <SwapTipsModal showType="modal" />
      <SelectTokenModal
        selectedToken={opTokenIn ? valueInfo.tokenIn : valueInfo.tokenOut}
        onConfirm={opTokenIn ? onTokenInChange : onTokenOutChange}
      />
      <SwapSettingsModal value={userSlippageTolerance} onConfirm={setUserSlippageTolerance} />
      <SwapConfirmModal
        routeType={opTokenIn ? RouteType.AmountIn : RouteType.AmountOut}
        slippageValue={slippageValue}
        amountOutMinValue={amountOutMinValue}
        priceImpact={priceImpact}
        swapFeeValue={swapFeeValue}
        gasFeeValue={gasFee}
        valueInfo={valueInfo}
        tokenOutUsd={tokenOutUsd}
        tokenInUsd={tokenInUsd}
        unitConversionShow={unitConversionShow}
        routerInfo={swapTokens}
        onConfirmSwap={handleConfirmSwapSuccess}
      />
    </div>
  );
}
