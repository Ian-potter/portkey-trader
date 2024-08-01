import { useCallback, useState, useMemo } from 'react';
import clsx from 'clsx';
import InputContainer from '../InputRow';
import CommonSvg from '../../../CommonSvg';
import CommonButton from '../../../CommonButton';
import { CircleProcess } from '../../../CircleProcess';
import { Currency } from '@awaken/sdk-core';
import { Tooltip } from 'antd';
import { isValidNumber } from '../../../../utils/reg';
import { ZERO } from '../../../../constants/misc';
import './index.less';
import SwapTipsModal from '../SwapTipsModal';
import SwapSettingsModal from '../SwapSettingsModal';
import { SwapConfirmModal } from '../SwapConfirmModal';
import { AwakenSwapProvider, useAwakenSwapContext } from '../../../../context/AwakenSwap';
import SelectTokenModal from '../SelectTokenModal';
import { swapActions } from '../../../../context/AwakenSwap/actions';

export interface ISwapPanel {
  wrapClassName?: string;
}

export type TSwapInfo = {
  tokenIn?: Currency | undefined;
  tokenOut?: Currency | undefined;

  valueIn: string;
  valueOut: string;
};

export enum BtnErrEnum {
  'error' = 'error',
  'none' = 'none',
  'tip' = 'tip',
}

export default function SwapPanel({ wrapClassName }: ISwapPanel) {
  const [, { dispatch }] = useAwakenSwapContext();
  const [extraPriceInfoShow, setExtraPriceInfoShow] = useState(false);
  const [valueInfo, setValueInfo] = useState<TSwapInfo>({
    tokenIn: undefined,
    tokenOut: undefined,

    valueIn: '',
    valueOut: '',
  });
  const [valueInBalance, setValueInBalance] = useState('');
  const [valueOutBalance, setValueOutBalance] = useState('');
  const [confirmBtnError, setConfirmBtnError] = useState<BtnErrEnum>(BtnErrEnum.none);

  const onValueInChange = useCallback(
    (v: string) => {
      if (v && !isValidNumber(v)) return;
      setValueInfo({
        ...valueInfo,
        valueIn: v,
      });
    },
    [valueInfo],
  );

  const onValueOutChange = useCallback(
    (v: string) => {
      if (v && !isValidNumber(v)) return;
      setValueInfo({
        ...valueInfo,
        valueOut: v,
      });
    },
    [valueInfo],
  );
  const onSelectTokenIn = useCallback(() => {
    // TODO open modal
  }, []);
  const onTokenInChange = useCallback((token: Currency) => {
    setValueInfo((pre) => ({
      ...pre,
      tokenIn: token,
    }));
  }, []);
  const onSelectTokenOut = useCallback(() => {
    // TODO open modal
  }, []);
  const onTokenOutChange = useCallback((token: Currency) => {
    setValueInfo((pre) => ({
      ...pre,
      tokenOut: token,
    }));
  }, []);
  const switchToken = useCallback(() => {
    setValueInfo((pre) => ({
      tokenIn: pre.tokenOut,
      tokenOut: pre.tokenIn,
      valueOut: pre.valueIn,
      valueIn: pre.valueOut,
    }));
  }, []);
  const onClickMax = useCallback(() => {
    //
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
        value={valueInfo.valueIn}
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
        balance={valueOutBalance}
        tokenInfo={valueInfo.tokenOut}
        wrapClassName="below-input-container"
        onInputChange={onValueOutChange}
        onSelectToken={onSelectTokenOut}
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

      <div className="swap-price-swap portkey-swap-flex-row-between">
        <div className="portkey-swap-flex-center">
          <div className="single-price-swap">{`1 ELF = 0.423567 USDT`}</div>
          <CommonSvg type="icon-price-switch" />
          <CircleProcess />
        </div>
        <CommonSvg
          type="icon-arrow-up2"
          onClick={() => setExtraPriceInfoShow(!extraPriceInfoShow)}
          className={clsx('portkey-swap-row-center', !extraPriceInfoShow && 'rotate-icon')}
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

      <CommonButton
        onClick={() => {
          dispatch(swapActions.setSettingModalShow.actions(true));
        }}>
        CLICKK
      </CommonButton>

      <SwapTipsModal />
      <SelectTokenModal />
      <SwapSettingsModal />
      <SwapConfirmModal gasFee={''} tokenInPrice={''} tokenOutPrice={''} />
    </div>
  );
}
