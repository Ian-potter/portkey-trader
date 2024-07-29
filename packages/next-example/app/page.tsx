'use client';
import { Button } from 'antd';
import { useCallback, useState } from 'react';
import { AwakenSwapper } from '@portkey/trader-core';
import { ChainId } from '@portkey/types';
import detectProvider from '@portkey/detect-provider';
import { aelf } from '@portkey/utils';
import { BestSwapRoutesAmountInParams, BestSwapRoutesAmountOutParams, RouteType } from '@portkey/trader-services';

const awaken = new AwakenSwapper({
  contractConfig: {
    contractAddress: '2vahJs5WeWVJruzd1DuTAu3TwK8jktpJ2NNeALJJWEbPQCUW4Y',
    rpcUrl: 'https://tdvw-test-node.aelf.io',
  },
  requestDefaults: {
    baseURL: 'https://test.awaken.finance',
  },
});

const ROUTE_TYPE = RouteType.AmountOut;

const swapperParams = {
  chainId: 'tDVW' as ChainId,
  symbolIn: 'ELF',
  symbolOut: 'USDT',
  // amountIn: 10,
  amountOut: 10 * 1e8,
};

export default function Home() {
  const [routerInfo, setRouterInfo] = useState<{
    feeRates: number[];
    path: string[];
    amount: number;
  }>();

  const onAwakenSwapper = useCallback(async () => {
    const bestRouters = await awaken.getBestRouters(ROUTE_TYPE, swapperParams);
    console.log(bestRouters, 'bestRouters====');

    const feeRates = bestRouters.routes[0].distributions[0].feeRates.map(item => item * 10000);
    const path = bestRouters.routes[0].distributions[0].tokens.map(item => item.symbol);
    const amount = swapperParams.amountOut;
    setRouterInfo({
      feeRates,
      path,
      amount,
    });
  }, []);

  const onAwakenCheckBestRouters = useCallback(async () => {
    if (!routerInfo) return;
    try {
      const check = await awaken.checkBestRouters({
        routeType: ROUTE_TYPE,
        ...routerInfo,
      });
      console.log(check, 'check===');
    } catch (error) {
      console.log(error, 'onAwakenCheckBestRouters===');
    }
  }, [routerInfo]);

  // const send = useCallback(async () => {
  //   // Portkey Extension

  //   //
  //   // Portkey sdk
  //   // contractOption: {
  //   //   account: aelf.getWallet('f6e512a3c259e5f9af981d7f99d245aa5bc52fe448495e0b0dd56e8406be6f71'),
  //   //   rpcUrl: 'https://tdvw-test-node.aelf.io',
  //   // },
  //   //
  //   // NightELF
  //   // contractOption: {
  //   //   // account: aelf.getWallet('f6e512a3c259e5f9af981d7f99d245aa5bc52fe448495e0b0dd56e8406be6f71'),
  //   //   rpcUrl: 'https://tdvw-test-node.aelf.io',
  //   // },
  // }, []);

  const onAwakenSwapPortkey = useCallback(async () => {
    const provider = await detectProvider();
    if (!provider) return;
    if (!routerInfo) return;
    // get chain provider
    const chainProvider = await provider.getChain('tDVW');
    // awaken.swap({
    //   routeType: swapperParams.routeType,
    //   amountOutMin: swapperParams.amountOut,
    //   amountIn: 1000,
    //   feeRates: routerInfo.feeRates,
    //   path: routerInfo.path,
    // });
    // contractOption: {
    //   chainProvider;
    // }
  }, [routerInfo]);

  return (
    <main className=" min-h-screen flex-col items-center justify-between p-24">
      <Button onClick={onAwakenSwapper}>awaken</Button>
      <div>------</div>

      <Button onClick={onAwakenCheckBestRouters}>checkBestRouters Awaken</Button>

      <div>------</div>

      <Button onClick={onAwakenSwapPortkey}>Awaken swap Portkey extension</Button>

      <div>------</div>
    </main>
  );
}
