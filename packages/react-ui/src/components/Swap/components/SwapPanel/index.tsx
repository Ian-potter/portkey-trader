import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { useEffectOnce } from 'react-use';
import clsx from 'clsx';
import InputContainer from '../InputRow';
import CommonSvg from '../../../CommonSvg';
import CommonButton from '../../../CommonButton';
import { CircleProcess, CircleProcessInterface } from '../../../CircleProcess';
// import { Token } from '@awaken/sdk-core';
import { Tooltip } from 'antd';
import { isValidNumber } from '../../../../utils/reg';
import { SWAP_TIME_INTERVAL, ZERO } from '../../../../constants/misc';
import './index.less';
import SwapTipsModal from '../SwapTipsModal';
import SwapSettingsModal from '../SwapSettingsModal';
import { SwapConfirmModal } from '../SwapConfirmModal';
import { AwakenSwapProvider, useAwakenSwapContext } from '../../../../context/AwakenSwap';
import SelectTokenModal from '../SelectTokenModal';
import { swapActions } from '../../../../context/AwakenSwap/actions';
import { useGetTokenPrice } from '../../../../hooks/price';
import { TTokenItem } from '../../../../types';
import {
  awaken,
  bigNumberToString,
  getPriceImpactWithBuy,
  minimumAmountOut,
  parseUserSlippageTolerance,
} from '../../../../utils/swap';
import { RouteType } from '@portkey/trader-services';
import { divDecimals, formatSymbol, formatPrice, timesDecimals, ONE } from '@portkey/trader-utils';
import CommonTooltip from '../../../CommonTooltip';
import { TSwapRoute } from '../../types';
import BigNumber from 'bignumber.js';
import TokenLogoPair from '../TokenLogoPair';
import { CurrencyLogos } from '../../../CurrencyLogo';

export interface ISwapPanel {
  wrapClassName?: string;
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

export default function SwapPanel({ wrapClassName }: ISwapPanel) {
  const [{ isMobile }, { dispatch }] = useAwakenSwapContext();

  console.log('isMobile', isMobile);
  const [extraPriceInfoShow, setExtraPriceInfoShow] = useState(false);
  const [valueInfo, setValueInfo] = useState<any>({
    tokenIn: {
      address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
      symbol: 'ELF',
      decimals: 8,
      chainId: 'tDVW',
      // id: 'b2aede10-f4e8-4d21-9e60-767cdd427f0f',
    },
    tokenOut: {
      address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
      symbol: 'USDT',
      decimals: 6,
      chainId: 'tDVW',
      id: '910301a7-ee78-425f-951d-60099c895ecc',
    },

    valueIn: '',
    valueOut: '',
  });

  const valueInfoRef = useRef(valueInfo);
  valueInfoRef.current = valueInfo;
  const [swapRoute, setSwapRoute] = useState<TSwapRoute>();
  const circleProcessRef = useRef<CircleProcessInterface>();
  const [tokenInUsd, setTokenInUsd] = useState('');
  const [tokenOutUsd, setTokenOutUsd] = useState('');
  const [valueInBalance, setValueInBalance] = useState('');
  const [valueOutBalance, setValueOutBalance] = useState('');
  const [confirmBtnError, setConfirmBtnError] = useState<BtnErrEnum>(BtnErrEnum.none);
  const [isUnitConversionReverse, setIsUnitConversionReverse] = useState(false);
  const getTokenPrice = useGetTokenPrice();
  const timerRef = useRef<NodeJS.Timeout>();
  // TODO
  const gasFee = 0;
  // TODO
  const userSlippageTolerance = '0.005';
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
    // routeListRef.current = undefined;
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

    // executeCbRef.current();
    circleProcessRef.current?.start();
    timerRef.current = setInterval(() => {
      // executeCbRef.current();
      circleProcessRef.current?.start();
    }, SWAP_TIME_INTERVAL);
  }, [clearTimer]);

  useEffectOnce(() => {
    const { tokenIn, tokenOut } = valueInfo;
    if (!tokenIn || !tokenOut) return;
    registerTimer();
  });

  useEffect(() => {
    if (!valueInfo.tokenIn?.symbol) return;
    getTokenPrice({
      symbol: valueInfo.tokenIn.symbol,
      chainId: 'tDVW',
      tokenAddress: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    })
      .then((res) => {
        setTokenInUsd(res);
      })
      .catch((err) => {
        setTokenInUsd('');
        console.log('===getTokenPrice error', err);
      });
  }, [getTokenPrice, valueInfo.tokenIn.symbol]);

  useEffect(() => {
    if (!valueInfo.tokenOut?.symbol) return;
    getTokenPrice({
      symbol: valueInfo.tokenOut.symbol,
      chainId: 'tDVW',
      tokenAddress: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    })
      .then((res) => {
        setTokenOutUsd(res);
      })
      .catch((err) => {
        setTokenOutUsd('');
        console.log('===getTokenPrice error', err);
      });
  }, [getTokenPrice, valueInfo.tokenIn.symbol, valueInfo.tokenOut.symbol]);

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

  const onValueInChange = useCallback(
    async (v: string) => {
      if (v && !isValidNumber(v)) return;
      setValueInfo((pre: any) => ({
        ...pre,
        valueIn: v,
      }));
      const params = {
        chainId: 'tDVW' as any,
        symbolIn: valueInfo.tokenIn.symbol,
        symbolOut: valueInfo.tokenOut.symbol,
        amountIn: timesDecimals(v, valueInfo.tokenIn.decimals).toFixed(),
      };
      const { bestRouters, swapTokens } = await awaken.getBestRouters(RouteType.AmountIn, params);
      const bestRoute = bestRouters?.[0];
      setSwapRoute(bestRoute as any);
      const _amountOut = divDecimals(bestRoute.amountOut, valueInfo.tokenOut.decimals).toFixed();
      setValueInfo((pre: any) => ({
        ...pre,
        valueOut: _amountOut,
      }));
      console.log('🌹🌹🌹onValueInChange', bestRouters, swapTokens);
    },
    [valueInfo],
  );

  const onValueOutChange = useCallback(
    async (v: string) => {
      if (v && !isValidNumber(v)) return;
      setValueInfo({
        ...valueInfo,
        valueOut: v,
      });
      const params = {
        chainId: 'tDVW' as any,
        symbolIn: valueInfo.tokenIn.symbol,
        symbolOut: valueInfo.tokenOut.symbol,
        amountOut: timesDecimals(v, valueInfo.tokenOut.decimals).toFixed(),
      };
      const { bestRouters, swapTokens } = await awaken.getBestRouters(RouteType.AmountOut, params);
      const bestRoute = bestRouters?.[0];
      setSwapRoute(bestRoute as any);
      const _amountIn = divDecimals(bestRoute.amountIn, valueInfo.tokenIn.decimals).toFixed();
      setValueInfo((pre: any) => ({
        ...pre,
        valueIn: _amountIn,
      }));
      console.log('🌹🌹🌹onValueOutChange', bestRouters, swapTokens);
    },
    [valueInfo],
  );
  const onSelectTokenIn = useCallback(() => {
    dispatch(swapActions.setSelectTokenModalShow.actions(true));
  }, [dispatch]);
  const onTokenInChange = useCallback((token: TTokenItem) => {
    setValueInfo((pre: any) => ({
      ...pre,
      tokenIn: token,
    }));
  }, []);
  const onSelectTokenOut = useCallback(() => {
    // TODO open modal
  }, []);
  const onTokenOutChange = useCallback((token: TTokenItem) => {
    setValueInfo((pre: any) => ({
      ...pre,
      tokenOut: token,
    }));
  }, []);
  const switchToken = useCallback(() => {
    setValueInfo((pre: any) => ({
      tokenIn: pre.tokenOut,
      tokenOut: pre.tokenIn,
      valueOut: pre.valueIn,
      valueIn: pre.valueOut,
    }));
  }, []);
  const onClickMax = useCallback(() => {
    //
  }, []);

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

  const extraPriceInfoData = useMemo(() => {
    return [
      {
        label: 'Max. Slippage',
        value: (
          <div className="portkey-swap-row-center">
            <span>{slippageValue}</span>
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
            <CurrencyLogos tokens={[valueInfo.tokenIn, valueInfo.tokenOut]} />

            {/* <TokenLogoPair token1={valueInfo.tokenIn} token2={valueInfo.tokenOut} /> */}
            <CommonSvg type="icon-arrow-up2" />
          </div>
        ),
        tooltipMsg: `Awaken's order routing selects the swap path with the lowest comprehensive cost to complete the transaction and increase the amount you receive.`,
      },
    ];
  }, [
    amountOutMinValue,
    dispatch,
    gasFeeValue,
    priceImpact,
    slippageValue,
    swapFeeValue,
    valueInfo.tokenIn,
    valueInfo.tokenOut,
  ]);

  const confirmBtnText = useMemo(() => {
    if (!(valueInfo.tokenIn && valueInfo.tokenOut)) {
      setConfirmBtnError(BtnErrEnum.tip);
      return `Select a token`;
    }
    if (valueInfo.valueIn || valueInfo.valueOut) {
      setConfirmBtnError(BtnErrEnum.tip);
      return `Enter an amount`;
    }
    if (ZERO.plus(valueInfo.valueIn).lt(valueInBalance)) {
      setConfirmBtnError(BtnErrEnum.error);
      return `Insufficient ${valueInfo.tokenIn.symbol} balance`;
    }
    setConfirmBtnError(BtnErrEnum.none);
    return `Swap`;
  }, [valueInBalance, valueInfo.tokenIn, valueInfo.tokenOut, valueInfo.valueIn, valueInfo.valueOut]);

  return (
    <div className={clsx('swap-panel-wrapper', wrapClassName)}>
      <InputContainer
        title="Pay"
        value={valueInfo.valueIn}
        priceInUsd={tokenInUsd}
        balance={valueInBalance}
        tokenInfo={valueInfo.tokenIn}
        onInputChange={onValueInChange}
        onSelectToken={onSelectTokenIn}
        showMax
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
            onClick={() => setExtraPriceInfoShow(!extraPriceInfoShow)}
            className={clsx('portkey-swap-row-center', !extraPriceInfoShow && 'rotate-icon')}
          />
        </div>
      )}

      {extraPriceInfoShow && (
        <div className="swap-price-swap-info portkey-swap-flex-column">
          {extraPriceInfoData.map((info, index: number) => (
            <div key={index} className="portkey-swap-flex-row-between price-swap-info-item">
              <div className="portkey-swap-flex-row-center">
                <span className="price-swap-info-label">{info.label}</span>
                <CommonTooltip
                  placement="top"
                  title={info.tooltipMsg}
                  getPopupContainer={(v) => v}
                  // buttonTitle={'ok'}
                  // headerDesc={'yyy'}
                />
              </div>
              <div className="price-swap-info-value">{info.value}</div>
            </div>
          ))}
        </div>
      )}

      <CommonButton
        onClick={() => {
          dispatch(swapActions.setSelectTokenModalShow.actions(true));
        }}>
        CLICKK
      </CommonButton>

      <SwapTipsModal />
      <SelectTokenModal />
      <SwapSettingsModal value={'0.4'} onConfirm={(v) => console.log(v)} />
      {/* <SwapConfirmModal gasFee={''} tokenInUsd={''} tokenOutUsd={''} /> */}
    </div>
  );
}
