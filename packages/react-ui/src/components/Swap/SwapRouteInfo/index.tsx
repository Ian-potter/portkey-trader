// import { Col, Row } from 'antd';
// import CommonTooltip from 'components/CommonTooltip';
// import Font from 'components/Font';
// import { TSwapRouteInfo } from 'pages/Swap/types';
// import { useTranslation } from 'react-i18next';
// import { useUserSettings } from 'contexts/useUserSettings';
// import { useMemo } from 'react';
// import { bigNumberToString, getPriceImpactWithBuy, minimumAmountOut } from 'utils/swap';
// import { ONE, ZERO } from 'constants/misc';
// import BigNumber from 'bignumber.js';
// import { divDecimals } from 'utils/calculate';
// import { SwapOrderRouting } from '../SwapOrderRouting';
// import { CurrencyLogos } from 'components/CurrencyLogo';
// import { Currency } from '@awaken/sdk-core';
// import { TSwapInfo } from '../SwapPanel';
// import { formatSymbol } from 'utils/token';
// import './styles.less';

// export type TSwapRouteInfoProps = {
//   swapInfo: TSwapInfo;
//   routeInfo: TSwapRouteInfo | undefined;
//   gasFee: string | 0;
//   isTipShow?: boolean;
//   isRoutingShow?: boolean;
// };

// export const SwapRouteInfo = ({
//   swapInfo,
//   routeInfo,
//   gasFee,
//   isTipShow = true,
//   isRoutingShow = true,
// }: TSwapRouteInfoProps) => {
//   const { t } = useTranslation();
//   const [{ userSlippageTolerance }] = useUserSettings();

//   const amountOutMinValue = useMemo(() => {
//     const { valueOut, tokenOut } = swapInfo;
//     if (!valueOut || !tokenOut) return '-';
//     const _value = bigNumberToString(minimumAmountOut(ZERO.plus(valueOut), userSlippageTolerance), tokenOut.decimals);
//     return `${_value} ${formatSymbol(tokenOut.symbol)}`;
//   }, [swapInfo, userSlippageTolerance]);

//   const priceImpact = useMemo(() => {
//     if (!routeInfo) return '-';
//     const impactList = routeInfo.recordList.map((item) => {
//       return getPriceImpactWithBuy(
//         ZERO.plus(item.tokenOutReserve),
//         ZERO.plus(item.tokenInReserve),
//         item.valueIn,
//         ZERO.plus(item.valueOut),
//       ).toFixed();
//     });

//     return `${bigNumberToString(BigNumber.max(...impactList), 2)}%`;
//   }, [routeInfo]);

//   const swapFeeValue = useMemo(() => {
//     const { tokenIn, valueIn } = swapInfo;
//     if (!routeInfo || !tokenIn || !valueIn) return '-';
//     const pathLength = routeInfo.route.path.length;
//     const feeRate = routeInfo.route.feeRate;

//     return `${ZERO.plus(valueIn)
//       .times(ONE.minus(ONE.minus(feeRate).pow(pathLength)))
//       .dp(tokenIn.decimals)
//       .toFixed()} ${formatSymbol(tokenIn.symbol)}`;
//   }, [routeInfo, swapInfo]);

//   const gasFeeValue = useMemo(() => {
//     return divDecimals(ZERO.plus(gasFee), 8);
//   }, [gasFee]);

//   const currencyLogoTokens = useMemo(() => {
//     const { tokenIn, tokenOut } = swapInfo;
//     return [tokenIn, tokenOut].filter((item) => !!item) as Currency[];
//   }, [swapInfo]);

//   return (
//     <>
//       <Row align={'middle'} justify={'space-between'}>
//         <Col className="swap-route-info-title">
//           <Font color="two" size={14} lineHeight={22}>
//             {t('minEaring')}
//           </Font>
//           {isTipShow && (
//             <CommonTooltip
//               placement="top"
//               title={t(
//                 'Min.Received refers to the exchange result at the price corresponding to the Max.Slippage you set.Generally, it will be more.',
//               )}
//               getPopupContainer={(v) => v}
//               buttonTitle={t('ok')}
//               headerDesc={t('minEaring')}
//             />
//           )}
//         </Col>

//         <Col>
//           <Font size={14} lineHeight={22}>
//             {amountOutMinValue}
//           </Font>
//         </Col>
//       </Row>

//       <Row align={'middle'} justify={'space-between'}>
//         <Col className="swap-route-info-title">
//           <Font color="two" size={14} lineHeight={22}>
//             {t('priceSlippage')}
//           </Font>
//           {isTipShow && (
//             <CommonTooltip
//               placement="top"
//               title={t(
//                 'The maximum impact on the currency price of the liquidity pool after the transaction is completed.',
//               )}
//               getPopupContainer={(v) => v}
//               buttonTitle={t('ok')}
//               headerDesc={t('priceSlippage')}
//             />
//           )}
//         </Col>

//         <Col>
//           <Font size={14} lineHeight={22}>
//             {priceImpact}
//           </Font>
//         </Col>
//       </Row>

//       <Row align={'middle'} justify={'space-between'}>
//         <Col className="swap-route-info-title">
//           <Font color="two" size={14} lineHeight={22}>
//             {t('Fee')}
//           </Font>
//           {isTipShow && (
//             <CommonTooltip
//               placement="top"
//               title={t('feeDescription')}
//               getPopupContainer={(v) => v}
//               buttonTitle={t('ok')}
//               headerDesc={t('Fee')}
//             />
//           )}
//         </Col>

//         <Col>
//           <Font size={14} lineHeight={22}>
//             {swapFeeValue}
//           </Font>
//         </Col>
//       </Row>

//       <Row align={'middle'} justify={'space-between'}>
//         <Col className="swap-route-info-title">
//           <Font color="two" size={14} lineHeight={22}>
//             {t('transactionFee')}
//           </Font>

//           {isTipShow && (
//             <CommonTooltip
//               placement="top"
//               title={t('transactionFeeDescription')}
//               getPopupContainer={(v) => v}
//               buttonTitle={t('ok')}
//               headerDesc={t('transactionFee')}
//             />
//           )}
//         </Col>

//         <Col>
//           <Font size={14} lineHeight={22}>
//             {`${gasFeeValue} ELF`}
//           </Font>
//         </Col>
//       </Row>

//       {isRoutingShow && (
//         <Row align={'middle'} justify={'space-between'}>
//           <Col className="swap-route-info-title">
//             <Font color="two" size={14} lineHeight={22}>
//               {t('Order Routing')}
//             </Font>

//             {isTipShow && (
//               <CommonTooltip
//                 placement="top"
//                 title={t(
//                   `Awaken's order routing selects the swap path with the lowest comprehensive cost to complete the transaction and increase the amount you receive.`,
//                 )}
//                 getPopupContainer={(v) => v}
//                 buttonTitle={t('ok')}
//                 headerDesc={t('Order Routing')}
//               />
//             )}
//           </Col>

//           <Col className="swap-order-routing-tip-wrap">
//             <CommonTooltip
//               width={'400px'}
//               placement="right"
//               title={<SwapOrderRouting route={routeInfo?.route} />}
//               getPopupContainer={(v) => v}
//               buttonTitle={t('ok')}
//               headerDesc={t('Order Routing')}>
//               <CurrencyLogos size={20} tokens={currencyLogoTokens} isSortToken={false} />
//             </CommonTooltip>
//           </Col>
//         </Row>
//       )}
//     </>
//   );
// };
