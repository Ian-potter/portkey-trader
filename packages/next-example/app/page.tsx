'use client';
import { Button } from 'antd';
import { useCallback, useState } from 'react';
import { AwakenSwapper, TBestRoutersAmountInfo } from '@portkey/trader-core';
import { ChainId } from '@portkey/types';
import detectProvider from '@portkey/detect-provider';
import { aelf } from '@portkey/utils';
import { BestSwapRoutesAmountInParams, BestSwapRoutesAmountOutParams, RouteType } from '@portkey/trader-services';
import { AElfReactProvider, useAElfReact } from '@aelf-react/core';

const awaken = new AwakenSwapper({
  contractConfig: {
    swapContractAddress: '2vahJs5WeWVJruzd1DuTAu3TwK8jktpJ2NNeALJJWEbPQCUW4Y',
    hookContractAddress: '2vahJs5WeWVJruzd1DuTAu3TwK8jktpJ2NNeALJJWEbPQCUW4Y',
    rpcUrl: 'https://tdvw-test-node.aelf.io',
  },
  requestDefaults: {
    baseURL: 'https://test.awaken.finance',
  },
});

const ROUTE_TYPE = RouteType.AmountIn;

const swapperParams = {
  chainId: 'tDVW' as ChainId,
  symbolIn: 'ELF',
  symbolOut: 'USDT',
  // amountIn: 10,
  amountIn: 10 * 1e8,
};

function APP() {
  const aelfReact = useAElfReact();

  const [routerInfo, setRouterInfo] = useState<
    {
      feeRates: number[];
      path: string[];
      amount: string;
    }[]
  >();

  const [swapInfo, setSwapInfo] = useState<TBestRoutersAmountInfo>();

  const onAwakenSwapper = useCallback(async () => {
    const { bestRouters, swapTokens } = await awaken.getBestRouters(ROUTE_TYPE, swapperParams);
    console.log(bestRouters, 'bestRouters====', swapTokens);

    setRouterInfo(swapTokens);
  }, []);

  const onAwakenCheckBestRouters = useCallback(async () => {
    if (!routerInfo) return;
    console.log(routerInfo, 'routerInfo==');
    try {
      const swapTokens = await awaken.checkBestRouters({
        routeType: ROUTE_TYPE,
        swapTokens: routerInfo,
      });
      console.log(swapTokens, 'check===');
      setSwapInfo(swapTokens);
    } catch (error) {
      console.log(error, 'onAwakenCheckBestRouters===');
    }
  }, [routerInfo]);

  const onAwakenSwapPortkey = useCallback(async () => {
    const provider = await detectProvider();
    if (!provider) return;
    if (!routerInfo) return;
    if (!swapInfo) return;
    // get chain provider
    const chainProvider = await provider.getChain('tDVW');
    const accountsResult = await provider.request({ method: 'requestAccounts' });
    const caAddress = accountsResult.tDVW?.[0];
    if (!caAddress) return;
    const result = await awaken.swap({
      routeType: ROUTE_TYPE,
      // amountOutMin: swapperParams.amountOut,
      // amountIn: swapperParams,
      // amountOut: swapInfo.,
      symbol: swapperParams.symbolIn,
      amountIn: swapperParams.amountIn,
      slippageTolerance: '0.005',
      bestSwapTokensInfo: swapInfo,
      contractOption: {
        chainProvider,
      },
      userAddress: caAddress,
      // toAddress: caAddress,
      // tokenApprove: async params => {
      //   await provider.request({
      //     method: 'sendTransaction',
      //   });
      // },
    });
    // console.log(result, 'result==');
  }, [swapInfo, routerInfo]);

  const onAwakenSwapNightELF = useCallback(async () => {
    if (!swapInfo) return;
    const provider = await aelfReact.activate({
      tDVW: {
        rpcUrl: 'https://tdvw-test-node.aelf.io',
        chainId: 'tDVW',
      },
    });

    const bridge = provider?.['tDVW'];
    if (!bridge) return;
    // // get chain provider

    const loginInfo = await bridge.login({ chainId: 'tDVW', payload: { method: 'LOGIN' } });
    await bridge.chain.getChainStatus();
    const address = JSON.parse(loginInfo?.detail ?? '{}').address;
    const result = await awaken.swap({
      routeType: ROUTE_TYPE,
      // amountOutMin: swapperParams.amountOut,
      // amountIn: swapperParams,
      // amountOut: swapInfo.,
      symbol: swapperParams.symbolIn,
      amountIn: swapperParams.amountIn,
      slippageTolerance: '0.005',
      bestSwapTokensInfo: swapInfo,
      contractOption: {
        aelfInstance: bridge,
        account: {
          address: address,
        },
      },
      userAddress: address,
      // toAddress: caAddress,
      // tokenApprove: async params => {
      //   await provider.request({
      //     method: 'sendTransaction',
      //   });
      // },
    });
  }, [aelfReact, swapInfo]);

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

  return (
    <main className=" min-h-screen flex-col items-center justify-between p-24">
      <Button onClick={onAwakenSwapper}>awaken</Button>
      <div>------</div>

      <Button disabled={!routerInfo} onClick={onAwakenCheckBestRouters}>
        checkBestRouters Awaken
      </Button>

      <div>------</div>

      <Button disabled={!swapInfo || !routerInfo} onClick={onAwakenSwapPortkey}>
        Awaken swap Portkey extension
      </Button>

      <Button disabled={!swapInfo || !routerInfo} onClick={onAwakenSwapNightELF}>
        Awaken swap NightELF
      </Button>

      <div>------</div>
    </main>
  );
}

export default function Home() {
  return (
    <AElfReactProvider
      appName="example"
      nodes={{
        tDVW: { rpcUrl: 'https://tdvw-test-node.aelf.io', chainId: 'tDVW' },
      }}>
      <APP />
    </AElfReactProvider>
  );
}
