import './styles.less';
import Font from '../../../Font';
import { useMemo } from 'react';
import { CurrencyLogo, CurrencyLogos } from '../../../CurrencyLogo';
import { ZERO } from '../../../../constants/misc';
import { TSwapRoute } from '../../types';
import { useIsMobile } from '../../../../hooks/device';

export type TSwapOrderRoutingProps = {
  swapRoute?: TSwapRoute;
};

export const SwapOrderRouting = ({ swapRoute }: TSwapOrderRoutingProps) => {
  const isMobile = useIsMobile();

  const routeList = useMemo(() => {
    if (swapRoute) {
      return swapRoute.distributions.map((path) => {
        return {
          percent: path.percent,
          tokensList: path.tradePairs.map((item, idx) => {
            return {
              tokens: [path.tokens[idx], path.tokens[idx + 1]],
              feeRate: `${ZERO.plus(item.feeRate).times(100).toFixed()}%`,
            };
          }),
        };
      });
    }

    return [];
  }, [swapRoute]);

  const firstToken = useMemo(() => {
    if (swapRoute) return swapRoute?.distributions[0]?.tokens[0];
  }, [swapRoute]);

  const lastToken = useMemo(() => {
    if (swapRoute) {
      const tokens = swapRoute?.distributions[0]?.tokens;
      return tokens?.[tokens?.length - 1];
    }
  }, [swapRoute]);

  if (!swapRoute) return <></>;
  return (
    <div className="swap-order-routing">
      {/* {!isMobile && (
        <div className="swap-order-header">
          <Font size={12} lineHeight={14}>
            {t('Order Routing')}
          </Font>
        </div>
      )} */}

      <div className="swap-order-content">
        {routeList.map((route, pathIdx) => (
          <div key={pathIdx} className="swap-order-route-wrap">
            {firstToken && (
              <div className="swap-order-token-icon">
                <CurrencyLogo size={16} symbol={firstToken.symbol} className={'swap-order-token-icon'} />
              </div>
            )}

            <div className="swap-order-route-info swap-order-route-percent">
              <Font size={12} lineHeight={14}>{`${route.percent}%`}</Font>
            </div>

            <div className="swap-order-route-content">
              {route.tokensList.map((item, idx) => (
                <div className="swap-order-route-info" key={idx}>
                  <CurrencyLogos size={16} tokens={item.tokens} isSortToken={false} />
                  <Font size={12} lineHeight={14}>
                    {item.feeRate}
                  </Font>
                </div>
              ))}
            </div>

            {lastToken && (
              <div className="swap-order-token-icon">
                <CurrencyLogo size={16} symbol={lastToken.symbol} className={'swap-order-token-icon'} />
              </div>
            )}

            <div className="swap-order-dot-line"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
