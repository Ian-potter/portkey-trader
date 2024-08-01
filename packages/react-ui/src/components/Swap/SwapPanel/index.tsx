import { useState, useMemo, useCallback } from 'react';
// import { sleep } from 'utils';
// import { useGetRouteList } from '../../hooks';
// import { TPairRoute, TSwapRouteInfo } from '../../types';
// import { SWAP_TIME_INTERVAL, ZERO } from 'constants/misc';
// import { getRouteInfoWithValueIn, getRouteInfoWithValueOut } from '../../utils';
// import Font from 'components/Font';
// import { ChainConstants } from 'constants/ChainConstants';
import { Currency } from '@awaken/sdk-core';
// import { useCurrencyBalancesV2 } from 'hooks/useBalances';
// import { bigNumberToUPString, getCurrencyAddress, parseUserSlippageTolerance } from 'utils/swap';
import SwapSelectTokenButton from '../SwapSelectTokenButton';
import SwapInputRow from '../SwapInputRow';
// import { IconArrowDown2, IconPriceSwitch, IconSettingFee, IconSwapDefault, IconSwapHover } from 'assets/icons';
// import { useReturnLastCallback } from 'hooks';
import { Col, Row, Tooltip } from 'antd';
import clsx from 'clsx';
// import CommonTooltip from 'components/CommonTooltip';
// import { useTranslation } from 'react-i18next';
// import SettingFee from 'Buttons/SettingFeeBtn';
// import { useUserSettings } from 'contexts/useUserSettings';
// import { useRequest } from 'ahooks';
// import { getTransactionFee } from 'pages/Exchange/apis/getTransactionFee';
// import { divDecimals } from 'utils/calculate';
// import AuthBtn from 'Buttons/AuthBtn';
// import { FontColor } from 'utils/getFontStyle';
// import { SwapRouteInfo } from '../SwapRouteInfo';
// import { useTokenPrice } from 'contexts/useTokenPrice/hooks';
// import { formatSymbol } from 'utils/token';
// import { useEffectOnce } from 'react-use';
// import { useModalDispatch } from 'contexts/useModal/hooks';
// import { basicModalView } from 'contexts/useModal/actions';
// import { SwapConfirmModal, SwapConfirmModalInterface } from '../SwapConfirmModal';
import './styles.less';
import Font from '../../Font';
import { CircleProcess } from '../../CircleProcess';
import CommonTooltip from '../../CommonTooltip';
import { ZERO } from '../../../constants/misc';
import CommonSvg from '../../CommonSvg';
import CommonButton from '../../CommonButton';
import { validate } from 'uuid';
// import { CircleProcess, CircleProcessInterface } from 'components/CircleProcess';
// import { formatPrice } from 'utils/price';
// import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';

export type TSwapInfo = {
  tokenIn?: Currency;
  tokenOut?: Currency;

  valueIn: string;
  valueOut: string;
  isFocusValueIn: boolean;
};

export const SwapPanel = () => {
  const [swapInfo, setSwapInfo] = useState<TSwapInfo>({
    // tokenIn: ChainConstants.constants.COMMON_BASES[2],
    // tokenOut: ChainConstants.constants.COMMON_BASES[0],
    // tokenIn: null,
    // tokenOut: null,

    valueIn: '',
    valueOut: '',
    isFocusValueIn: true,
  });
  const [extraPriceInfoShow, setExtraPriceInfoShow] = useState(false);

  const [isRouteEmpty] = useState(false);

  const isExtraInfoShow = useMemo(() => {
    const { tokenIn, tokenOut } = swapInfo;
    if (!tokenIn || !tokenOut) return false;
    // if (!valueIn && !valueOut) return false;
    return true;
  }, [swapInfo]);

  const onTokenChange = useCallback(() => {
    // TODO
  }, []);

  const setTokenIn = useCallback(
    async (tokenIn?: Currency) => {
      if (!tokenIn) return;
      setSwapInfo((pre) => {
        const isSwitch = pre.tokenOut?.symbol === tokenIn.symbol;
        if (!isSwitch)
          return {
            ...pre,
            tokenIn,
            isFocusValueIn: true,
            valueIn: '',
            valueOut: '',
          };
        return {
          ...pre,
          tokenIn,
          tokenOut: pre.tokenIn,
          isFocusValueIn: !pre.isFocusValueIn,
          valueOut: pre.isFocusValueIn ? pre.valueIn : '',
          valueIn: pre.isFocusValueIn ? '' : pre.valueOut,
        };
      });
      onTokenChange();
    },
    [onTokenChange],
  );

  const setTokenOut = useCallback(
    async (tokenOut?: Currency) => {
      if (!tokenOut) return;
      setSwapInfo((pre) => {
        const isSwitch = pre.tokenIn?.symbol === tokenOut.symbol;
        if (!isSwitch)
          return {
            ...pre,
            tokenOut,
            isFocusValueIn: true,
            valueOut: '',
          };

        return {
          ...pre,
          tokenOut,
          tokenIn: pre.tokenOut,
          isFocusValueIn: !pre.isFocusValueIn,
          valueOut: pre.isFocusValueIn ? pre.valueIn : '',
          valueIn: pre.isFocusValueIn ? '' : pre.valueOut,
        };
      });
      onTokenChange();
    },
    [onTokenChange],
  );

  const switchToken = useCallback(async () => {
    setSwapInfo((pre) => ({
      ...pre,
      tokenIn: pre.tokenOut,
      tokenOut: pre.tokenIn,
      isFocusValueIn: !pre.isFocusValueIn,
      valueOut: pre.isFocusValueIn ? pre.valueIn : '',
      valueIn: pre.isFocusValueIn ? '' : pre.valueOut,
    }));
    onTokenChange();
  }, [onTokenChange]);

  const setValueIn = useCallback(async (value: string) => {
    setSwapInfo((pre) => ({
      ...pre,
      valueIn: value,
      valueOut: '',
      isFocusValueIn: true,
    }));
    // refreshTokenValueDebounce();
  }, []);

  const setValueOut = useCallback(async (value: string) => {
    setSwapInfo((pre) => ({ ...pre, valueOut: value, valueIn: '', isFocusValueIn: false }));
    // refreshTokenValueDebounce();
  }, []);
  const extraPriceInfoData = useMemo(() => {
    return [
      {
        label: 'Max. Slippage',
        value: (
          <div className="portkey-swap-row-center">
            <span>0.5%</span>
            <CommonSvg type="icon-edit" />
          </div>
        ),
        tooltipMsg: `The trade will be cancelled when slippage exceeds this percentage.`,
      },
      {
        label: 'Min. Received',
        value: '1.990049 USDT',
        tooltipMsg: `Min.Received refers to the exchange result at the price corresponding to the Max.Slippage you set.Generally, it will be more.`,
      },
      {
        label: 'Price Impact',
        value: '0.11%',
        tooltipMsg: `The maximum impact on the currency price of the liquidity pool after the transaction is completed.`,
      },
      {
        label: 'Swap Fee',
        value: '0.00059107 ELF',
        tooltipMsg: `The accumulated fee share of this trading pair's positions.`,
      },
      {
        label: 'Network Cost',
        value: '0.0048 ELF',
        tooltipMsg: `Network Cost are the miner fees paid in order for transactions to proceed.`,
      },
      {
        label: 'Order Routing',
        value: 'xxx',
        tooltipMsg: `Awaken's order routing selects the swap path with the lowest comprehensive cost to complete the transaction and increase the amount you receive.`,
      },
    ];
  }, []);

  return (
    <>
      <div className="swap-panel">
        <SwapInputRow
          title={'Pay'}
          value={swapInfo.valueIn}
          onChange={setValueIn}
          // balance={'currencyBalances?.[getCurrencyAddress(swapInfo.tokenIn)]' }
          balance={ZERO}
          token={swapInfo.tokenIn}
          showMax={true}
          gasFee={'gasFee'}
          suffix={
            <SwapSelectTokenButton
              className={clsx('swap-select-token-btn', swapInfo.tokenIn && 'swap-select-token-btn-selected')}
              type="default"
              size="middle"
              token={swapInfo.tokenIn}
              setToken={setTokenIn}
            />
          }
        />
        <div className="swap-token-switch-wrap">
          <div className="swap-token-switch-btn portkey-swap-flex-center" onClick={switchToken}>
            <CommonSvg type="icon-arrow-left2" className="swap-token-switch-btn-default" />
            <CommonSvg type="icon-price-switch" className="swap-token-switch-btn-hover" />
          </div>
        </div>
        <SwapInputRow
          className="swap-input-out-row"
          title={'Receive'}
          value={swapInfo.valueOut}
          onChange={setValueOut}
          // balance={currencyBalances?.[getCurrencyAddress(swapInfo.tokenOut)]}
          token={swapInfo.tokenOut}
          suffix={
            <SwapSelectTokenButton
              className={clsx('swap-select-token-btn', swapInfo.tokenOut && 'swap-select-token-btn-selected')}
              type="default"
              size="middle"
              token={swapInfo.tokenOut}
              setToken={setTokenOut}
            />
          }
          usdSuffix={
            <>
              {'usdImpactInfo' && (
                // <Font size={14} color={"usdImpactInfo?.fontColor"}>
                <Font size={14}>{'usdImpactInfo?.label'}</Font>
              )}
            </>
          }
        />

        {isRouteEmpty && (
          <div className="route-empty-warning">
            <div className="route-empty-warning-icon-wrap">
              <span className="route-empty-warning-icon" />
            </div>
            <Font color="two" lineHeight={20}>
              {'The current transaction is not supported, You can create the pair yourself.'}
            </Font>
          </div>
        )}

        <div className="swap-btn-wrap">
          <CommonButton>Select a token</CommonButton>
          {/* <AuthBtn
            type={swapBtnInfo.type}
            size="large"
            className={clsx('swap-btn', swapBtnInfo.className)}
            onClick={onSwapClick}
            loading={isSwapping}
            disabled={!!'!swapBtnInfo.active'}>
            <Font size={16} color={swapBtnInfo.fontColor}>
              {'swapBtnInfo.label'}
            </Font>
          </AuthBtn> */}
        </div>

        <div className="swap-price-swap portkey-swap-flex-row-between">
          <div className="portkey-swap-flex-center">
            <div className="single-price-swap">{`1 ELF = 0.423567 USDT`}</div>
            <CommonSvg type="icon-price-switch" />
            <CircleProcess />
          </div>
          <CommonSvg
            type="icon-arrow-up2"
            onClick={() => setExtraPriceInfoShow(!extraPriceInfoShow)}
            className={clsx('portkey-swap-row-center', extraPriceInfoShow && 'rotate-icon')}
          />
        </div>

        {extraPriceInfoShow && (
          <div className="swap-price-swap-info portkey-swap-flex-column">
            {extraPriceInfoData.map((info, index: number) => (
              <div key={index} className="portkey-swap-flex-row-between price-swap-info-item">
                <div className="portkey-swap-flex-row-center">
                  <span className="price-swap-info-label">{info.label}</span>
                  <Tooltip title={info.tooltipMsg}>
                    <CommonSvg type="icon-tip-qs" />
                  </Tooltip>
                </div>
                <div className="price-swap-info-value">{info.value}</div>
              </div>
            ))}
          </div>
        )}

        {isExtraInfoShow && (
          <>
            <Row className="swap-extra-wrap" align={'middle'} justify={'space-between'}>
              <Col className="price-warp">
                {/* {priceLabel !== '-' && (
                  <>
                    <Font size={16} lineHeight={24}>
                      {'priceLabel'}
                    </Font>
                    <IconPriceSwitch className="price-switch-btn" onClick={()=>{console.log(" onReversePrice")}} />
                  </>
                )} */}

                {/* <CircleProcess ref={circleProcessRef} /> */}
                <CircleProcess />
              </Col>
              <Col>
                {/* <IconArrowDown2 
                 className={clsx('swap-detail-btn', isDetailShow && 'swap-detail-btn-show')}
                 onClick={switchDetailShow}
                 /> */}
              </Col>
            </Row>

            <div className={clsx('swap-detail', 'isDetailShow' && 'swap-detail-show')}>
              <Row align={'middle'} justify={'space-between'}>
                <Col className="swap-detail-title">
                  <Font color="two" size={14} lineHeight={22}>
                    {'slippageTolerance'}
                  </Font>

                  <CommonTooltip
                    placement="top"
                    title={'tradingSettingTip1'}
                    getPopupContainer={(v) => v}
                    buttonTitle={'ok'}
                    headerDesc={'slippageTolerance'}
                  />
                </Col>

                <Row gutter={[4, 0]} align="middle">
                  <Col>
                    <Font size={14} lineHeight={22} suffix="%">
                      {'slippageValue'}
                    </Font>
                  </Col>
                  <Col>
                    {/* <SettingFee className="slippage-set-fee">
                      <IconSettingFee />
                    </SettingFee> */}
                  </Col>
                </Row>
              </Row>

              {/* {optimumRouteInfo && <SwapRouteInfo swapInfo={swapInfo} routeInfo={optimumRouteInfo} gasFee={gasFee} />} */}
            </div>
          </>
        )}
      </div>

      {/* <SwapConfirmModal
        ref={swapConfirmModalRef}
        tokenInPrice={tokenInPrice}
        tokenOutPrice={tokenOutPrice}
        gasFee={gasFee}
        onSuccess={onSwapSuccess}
      /> */}
    </>
  );
};
