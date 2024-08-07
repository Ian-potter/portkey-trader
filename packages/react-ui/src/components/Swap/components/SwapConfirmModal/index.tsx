import Font from '../../../Font';
import { useMemo, useCallback, useState } from 'react';
import { divDecimals, formatSymbol, timesDecimals, ZERO } from '@portkey/trader-utils';
import { Col, Row, message } from 'antd';
import CommonModal from '../../../CommonModal';
import CommonButton from '../../../CommonButton';
import { CurrencyLogo } from '../../../CurrencyLogo';

import { useAwakenSwapContext } from '../../../../context/AwakenSwap';
import { swapActions } from '../../../../context/AwakenSwap/actions';
import CommonModalHeader from '../../../CommonModalHeader';
import { IValueInfo } from '../SwapPanel';
import './styles.less';
import { RouteType } from '@portkey/trader-services';
import { TSwapToken } from '@portkey/trader-core';

export interface SwapConfirmModalInterface {
  slippageValue: string;
  amountOutMinValue: string;
  priceImpact: string;
  swapFeeValue: string;
  gasFeeValue: number;
  valueInfo: IValueInfo;
  tokenOutUsd: string;
  tokenInUsd: string;
  unitConversionShow: string;
  routerInfo?: TSwapToken[];
  onConfirmSwap?: () => void;
}

export const SwapConfirmModal = ({
  gasFeeValue,
  slippageValue,
  amountOutMinValue,
  priceImpact,
  swapFeeValue,
  valueInfo,
  tokenOutUsd,
  tokenInUsd,
  unitConversionShow,
  routerInfo,
  onConfirmSwap,
}: SwapConfirmModalInterface) => {
  const [{ isConfirmModalShow, awaken, isMobile }, { dispatch }] = useAwakenSwapContext();
  const [isSwapping, setIsSwapping] = useState(false);

  // }, [userSlippageTolerance]);

  // const priceIn = useMemo(
  //   () =>
  //     ZERO.plus(swapInfo?.valueIn || 0)
  //       .times(tokenInPrice)
  //       .dp(2)
  //       .toFixed(),
  //   [swapInfo?.valueIn, tokenInPrice],
  // );

  // const priceOut = useMemo(
  //   () =>
  //     ZERO.plus(swapInfo?.valueOut || 0)
  //       .times(tokenOutPrice)
  //       .dp(2)
  //       .toFixed(),
  //   [swapInfo?.valueOut, tokenOutPrice],
  // );

  // const executeCb = useCallback(async () => {
  //     return;

  //   if (!swapInfo || !routeInfo || !routeContract) return;
  //   const { tokenIn, tokenOut, valueIn } = swapInfo;
  //   if (!tokenIn || !tokenOut) return;
  //   const valueInAmountBN = timesDecimals(valueIn, tokenIn.decimals);
  //   const valueInAmount = valueInAmountBN.toFixed();
  //   const path = routeInfo.route.rawPath.map(item => item.symbol);
  //   try {
  //     const amountResult = await getValueOut(routeContract, valueInAmount, path);
  //     const amountOutAmount: string | undefined = amountResult?.amount?.[amountResult?.amount?.length - 1];
  //     if (!amountOutAmount) return;
  //     const amountOutValue = divDecimals(amountOutAmount, tokenOut.decimals).toFixed();

  //     console.log('SwapConfirmModal amountOutValue', amountOutValue);
  //     setSwapInfo(pre => {
  //       if (!pre) return pre;
  //       return {
  //         ...pre,
  //         valueOut: amountOutValue,
  //       };
  //     });

  //     return {
  //       value: amountOutValue,
  //       amount: amountOutAmount,
  //     };
  //   } catch (error) {
  //     console.log('SwapConfirmModal executeCb error:', error);
  //     return;
  //   }
  // }, [ routeInfo, swapInfo]);
  // const executeCbRef = useRef(executeCb);
  // executeCbRef.current = executeCb;

  // const timerRef = useRef<NodeJS.Timeout>();
  // const clearTimer = useCallback(() => {
  //   if (!timerRef.current) return;
  //   clearInterval(timerRef.current);
  //   console.log('SwapConfirmModal: clearTimer');
  // }, []);

  // const registerTimer = useCallback(() => {
  //   clearTimer();
  //   console.log('SwapConfirmModal: registerTimer');

  //   executeCbRef.current();
  //   timerRef.current = setInterval(() => {
  //     executeCbRef.current();
  //   }, SWAP_TIME_INTERVAL);
  // }, [clearTimer]);

  // const show = useCallback<SwapConfirmModalInterface['show']>(
  //   ({ swapInfo, routeInfo, priceLabel }) => {
  //     setSwapInfo(JSON.parse(JSON.stringify(swapInfo)));
  //     setRouteInfo(JSON.parse(JSON.stringify(routeInfo)));
  //     setPriceLabel(priceLabel);
  //     registerTimer();
  //     setIsVisible(true);
  //   },
  //   [registerTimer],
  // );
  // useImperativeHandle(ref, () => ({ show }));

  // const onCancel = useCallback(() => {
  //   setIsVisible(false);
  //   setSwapInfo(undefined);
  //   setRouteInfo(undefined);
  //   setPriceLabel('');
  //   clearTimer();
  // }, [clearTimer]);

  // const [isSwapping, setIsSwapping] = useState(false);
  // const { account } = useActiveWeb3React();
  // const tokenInAddress = useMemo(() => getCurrencyAddress(swapInfo?.tokenIn), [swapInfo?.tokenIn]);
  // const { approve, checkAllowance } = useAllowanceAndApprove(
  //   ChainConstants.constants.TOKEN_CONTRACT,
  //   tokenInAddress,
  //   account || undefined,
  //   routeContract?.address,
  // );
  // const onConfirmClick = useCallback(async () => {
  //   if (!swapInfo || !routeInfo || !routeContract) return;
  //   const { tokenIn, tokenOut, valueIn, valueOut } = swapInfo;
  //   if (!tokenIn || !tokenOut || !valueIn || !valueOut) return;

  //   const { route } = routeInfo;
  //   const routeSymbolIn = route.rawPath?.[0]?.symbol;
  //   const routeSymbolOut = route.rawPath?.[route.rawPath?.length - 1]?.symbol;
  //   if (tokenIn.symbol !== routeSymbolIn || tokenOut.symbol !== routeSymbolOut) return;

  //   setIsSwapping(true);
  //   try {
  //     const valueInAmountBN = timesDecimals(valueIn, tokenIn.decimals);
  //     const valueOutAmountBN = timesDecimals(valueOut, tokenOut.decimals);
  //     const valueInAmount = valueInAmountBN.toFixed();
  //     const allowance = await checkAllowance();
  //     if (valueInAmountBN.gt(allowance)) {
  //       await approve(valueInAmountBN);
  //     }
  //     const path = route.rawPath.map(item => item.symbol);
  //     console.log('SwapConfirmModal: valueInAmount', valueInAmount, path, routeContract.address);

  //     const amountResult = await executeCbRef.current();
  //     if (!amountResult) return;
  //     const amountOutAmount = amountResult.amount;

  //     console.log('SwapConfirmModal: amountOutAmount', amountOutAmount);
  //     const amountMinOutAmountBN = minimumAmountOut(valueOutAmountBN, userSlippageTolerance);

  //     if (amountMinOutAmountBN.gt(amountOutAmount)) {
  //       notification.warning({
  //         message: null,
  //         description: t('The price has changed, please re-initiate the transaction'),
  //       });
  //       return;
  //     }

  //     console.log('onSwap', {
  //       account,
  //       routerContract: routeContract,
  //       path,
  //       amountIn: valueInAmountBN,
  //       amountOutMin: amountMinOutAmountBN,
  //       tokenB: tokenIn,
  //       tokenA: tokenOut,
  //     });

  //     const req = await onSwap({
  //       account,
  //       routerContract: routeContract,
  //       path,
  //       amountIn: valueInAmountBN,
  //       amountOutMin: amountMinOutAmountBN,
  //       tokenB: tokenIn,
  //       tokenA: tokenOut,
  //       t,
  //     });
  //     if (req !== REQ_CODE.UserDenied) {
  //       onSuccess?.();
  //       onCancel();
  //       return true;
  //     }
  //   } catch (error) {
  //     console.log('SwapConfirmModal onSwap error', error);
  //   } finally {
  //     console.log('onSwap finally');
  //     setIsSwapping(false);
  //   }
  // }, [
  //   account,
  //   approve,
  //   checkAllowance,
  //   onCancel,
  //   onSuccess,
  //   routeContract,
  //   routeInfo,
  //   swapInfo,
  //   t,
  //   userSlippageTolerance,
  // ]);

  const inUSD = useMemo(() => {
    if (!(valueInfo.valueIn && tokenInUsd)) return '-';
    return `$${ZERO.plus(valueInfo.valueIn).times(tokenInUsd).toFixed(2)}`;
  }, [tokenInUsd, valueInfo.valueIn]);
  const outUSD = useMemo(() => {
    if (!(valueInfo.valueOut && tokenOutUsd)) return '-';
    return `$${ZERO.plus(valueInfo.valueOut).times(tokenOutUsd).toFixed(2)}`;
  }, [tokenOutUsd, valueInfo.valueOut]);

  const approveAndSwap = useCallback(async () => {
    if (!awaken) return;
    if (!routerInfo) return;
    setIsSwapping(true);

    try {
      const options = await awaken?.getOptions?.();
      console.log('options', options);
      if (!options?.contractOptions) return;

      const swapTokens = await awaken?.instance?.checkBestRouters({
        routeType: RouteType.AmountIn,
        swapTokens: routerInfo,
      });
      if (!swapTokens) return;

      await awaken?.instance?.swap({
        routeType: RouteType.AmountIn,
        contractOption: options?.contractOptions,
        amountIn: timesDecimals(valueInfo.valueIn, valueInfo.tokenIn?.decimals).toFixed(),
        symbol: `${valueInfo.tokenIn?.symbol}`,
        bestSwapTokensInfo: swapTokens,
        slippageTolerance: ZERO.plus(slippageValue).div(100).toFixed(),
        userAddress: options.address,
        tokenApprove: awaken.tokenApprove,
      });
      message.success('Swap Success!');
      dispatch(swapActions.setConfirmModalShow.actions(false));
      onConfirmSwap?.();
    } catch (error) {
      console.log('===approveAndSwap error', error);
    } finally {
      setIsSwapping(false);
    }
  }, [awaken, dispatch, onConfirmSwap, routerInfo, slippageValue, valueInfo]);

  return (
    <CommonModal
      width="420px"
      height={isMobile ? '70%' : '522px'}
      showBackIcon={false}
      closable={true}
      centered={true}
      open={isConfirmModalShow}
      title={false}
      className={'swap-confirm-modal'}
      onCancel={() => {
        dispatch(swapActions.setConfirmModalShow.actions(false));
      }}>
      <CommonModalHeader
        title="Confirm"
        showClose
        onClose={() => dispatch(swapActions.setConfirmModalShow.actions(false))}
      />
      <div className="content-wrap">
        <div className="swap-confirm-modal-content">
          <div className="swap-confirm-modal-input-wrap">
            <div className="swap-confirm-modal-input-info">
              <span className="titlew">{'Pay'}</span>
              <Font size={24} lineHeight={32}>{`${valueInfo?.valueIn} ${formatSymbol(
                valueInfo.tokenIn?.symbol,
              )}`}</Font>
              <Font size={14} lineHeight={22} color="two">
                {inUSD}
              </Font>
            </div>
            <CurrencyLogo size={36} symbol={valueInfo.tokenIn?.symbol} />
          </div>
          <div className="swap-confirm-modal-input-wrap">
            <div className="swap-confirm-modal-input-info">
              <Font size={14} lineHeight={22} color="two">
                {'Receive'}
              </Font>
              <Font size={24} lineHeight={32}>{`${valueInfo?.valueOut} ${formatSymbol(
                valueInfo?.tokenOut?.symbol,
              )}`}</Font>
              <Font size={14} lineHeight={22} color="two">
                {outUSD}
              </Font>
            </div>
            <CurrencyLogo size={36} symbol={valueInfo.tokenOut?.symbol} />
          </div>

          <div className="swap-confirm-modal-detail">
            <Row align={'middle'} justify={'space-between'}>
              <Col className="swap-detail-title">
                <Font color="two" size={14} lineHeight={22}>
                  {'Rate'}
                </Font>
              </Col>

              <Row gutter={[4, 0]} align="middle">
                <Col>
                  <Font size={14} lineHeight={22} weight="medium">
                    {unitConversionShow}
                  </Font>
                </Col>
              </Row>
            </Row>

            <Row align={'middle'} justify={'space-between'}>
              <Col className="swap-detail-title">
                <Font color="two" size={14} lineHeight={22}>
                  {'Max. Slippage'}
                </Font>
              </Col>

              <Row gutter={[4, 0]} align="middle">
                <Col>
                  <Font size={14} lineHeight={22} suffix="%" weight="medium">
                    {slippageValue}
                  </Font>
                </Col>
              </Row>
            </Row>

            <Row align={'middle'} justify={'space-between'}>
              <Col className="swap-detail-title">
                <Font color="two" size={14} lineHeight={22}>
                  {'Min. Received'}
                </Font>
              </Col>

              <Row gutter={[4, 0]} align="middle">
                <Col>
                  <Font size={14} lineHeight={22} weight="medium">
                    {amountOutMinValue}
                  </Font>
                </Col>
              </Row>
            </Row>

            <Row align={'middle'} justify={'space-between'}>
              <Col className="swap-detail-title">
                <Font color="two" size={14} lineHeight={22}>
                  {'Price Impact'}
                </Font>
              </Col>

              <Row gutter={[4, 0]} align="middle">
                <Col>
                  <Font size={14} lineHeight={22} weight="medium">
                    {priceImpact}
                  </Font>
                </Col>
              </Row>
            </Row>

            <Row align={'middle'} justify={'space-between'}>
              <Col className="swap-detail-title">
                <Font color="two" size={14} lineHeight={22}>
                  {'Swap Fee'}
                </Font>
              </Col>

              <Row gutter={[4, 0]} align="middle">
                <Col>
                  <Font size={14} lineHeight={22} weight="medium">
                    {swapFeeValue}
                  </Font>
                </Col>
              </Row>
            </Row>

            <Row align={'middle'} justify={'space-between'}>
              <Col className="swap-detail-title">
                <Font color="two" size={14} lineHeight={22}>
                  {'Network Cost'}
                </Font>
              </Col>

              <Row gutter={[4, 0]} align="middle">
                <Col>
                  <Font size={14} lineHeight={22} weight="medium">
                    {`${divDecimals(gasFeeValue, 8).toFixed()} ELF`}
                  </Font>
                </Col>
              </Row>
            </Row>
          </div>
        </div>
        <CommonButton
          onClick={approveAndSwap}
          disabled={isSwapping}
          loading={isSwapping}
          className="swap-confirm-modal-btn"
          type="primary">
          {'Confirm Swap'}
        </CommonButton>
      </div>
    </CommonModal>
  );
};
