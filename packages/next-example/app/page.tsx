'use client';
import { Button, Select } from 'antd';
import { useCallback, useMemo, useRef, useState } from 'react';
import { AwakenSwapper, TBestRoutersAmountInfo, TContractOption, TTokenApproveHandler } from '@portkey/trader-core';
import { ChainId } from '@portkey/types';
import detectProvider from '@portkey/detect-provider';
import { aelf } from '@portkey/utils';
import { BestSwapRoutesAmountInParams, BestSwapRoutesAmountOutParams, RouteType } from '@portkey/trader-services';
import { Swap, ComponentType } from '@portkey/trader-react-ui';
import { Currency } from '@awaken/sdk-core';
import { AElfReactProvider, useAElfReact } from '@aelf-react/core';
import {
  PortkeyProvider,
  SignIn,
  ISignIn,
  did,
  ConfigProvider,
  managerApprove,
  getChainInfo,
} from '@portkey/did-ui-react';
import { storage } from '@/constants/storageKey';
import { getContractBasic } from '@portkey/contracts';
import '@portkey/did-ui-react/dist/assets/index.css';
import '@portkey/trader-react-ui/dist/assets/index.css';
import { WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';

ConfigProvider.setGlobalConfig({
  connectUrl: 'https://auth-aa-portkey-test.portkey.finance',
  requestDefaults: {
    timeout: 30000,
    baseURL: 'https://aa-portkey-test.portkey.finance',
  },
  serviceUrl: 'https://aa-portkey-test.portkey.finance',
});

const awaken = new AwakenSwapper({
  contractConfig: {
    swapContractAddress: '2vahJs5WeWVJruzd1DuTAu3TwK8jktpJ2NNeALJJWEbPQCUW4Y',
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
  const signInRef = useRef<ISignIn>();

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

  const [contractOptions, setContractOption] = useState<TContractOption>();
  const [useAddress, setUseAddress] = useState<string>();

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
    setSwapInfo(undefined);
    setRouterInfo(undefined);
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
    console.log(result, 'swap====result');
    setSwapInfo(undefined);
    setRouterInfo(undefined);
  }, [aelfReact, swapInfo]);

  const onAwakenSwapPortkeySDK = useCallback(async () => {
    if (!swapInfo) return;
    const wallet = await did.load('111111', storage.wallet);
    if (!wallet.didWallet.managementAccount) return signInRef.current?.setOpen(true);
    console.log(wallet, 'wallet==');
    const originChainId = localStorage.getItem(storage.originChainId) as ChainId;

    const caHash = did.didWallet.caInfo[originChainId].caHash;
    const chainInfo = await getChainInfo(originChainId);

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
        account: aelf.getWallet(wallet.didWallet.managementAccount.privateKey),
        callType: 'ca',
        caHash,
        caContractAddress: chainInfo.caContractAddress,
      },
      userAddress: wallet.didWallet.aaInfo.accountInfo?.caAddress || '',
      // toAddress: caAddress,
      tokenApprove: async params => {
        const [portkeyContract, tokenContract] = await Promise.all(
          [chainInfo.caContractAddress, chainInfo.defaultToken.address].map(ca =>
            getContractBasic({
              contractAddress: ca,
              account: aelf.getWallet(did.didWallet.managementAccount?.privateKey || ''),
              rpcUrl: chainInfo.endPoint,
            }),
          ),
        );

        const result = await managerApprove({
          originChainId: originChainId,
          symbol: params.symbol,
          caHash,
          amount: params.amount,
          spender: params.spender,
          targetChainId: originChainId,
          networkType: 'TESTNET',
          dappInfo: {
            icon: 'https://icon.horse/icon/localhost:3000/50',
            href: 'http://localhost:3000',
            name: 'localhost',
          },
        });
        console.log(result, 'result===');

        const approveResult = await portkeyContract.callSendMethod('ManagerApprove', '', {
          caHash,
          spender: params.spender,
          symbol: result.symbol,
          amount: result.amount,
          guardiansApproved: result.guardiansApproved,
        });
        if (approveResult.error) throw approveResult.error;
      },
    });

    setSwapInfo(undefined);
    setRouterInfo(undefined);
    // console.log(result, 'swap====result');
  }, [swapInfo]);

  const getSupportTokenList = useCallback(async () => {
    const list = await awaken.getSupportTokenList({ chainId: 'tDVW' });
    console.log(list, 'getSupportTokenList');
  }, []);

  const getBalance = useCallback(async () => {
    const COMMON_PRIVATE = 'f6e512a3c259e5f9af981d7f99d245aa5bc52fe448495e0b0dd56e8406be6f71';
    const res = await awaken.getBalance({
      symbol: 'ELF',
      owner: 'LEwNefrRAcYtQWFvTZTXykPca7QrijatqgbmAqB5M4Ud2yJGL',
      contractOption: {
        account: aelf.getWallet(COMMON_PRIVATE),
      },
    });
    console.log('🌹🌹🌹GetBalance', res);
  }, []);

  const [walletType, setWalletType] = useState<WalletTypeEnum>(WalletTypeEnum.unknown);

  const tokenApprove: TTokenApproveHandler = useCallback(async params => {
    const wallet = await did.load('111111', storage.wallet);
    if (!wallet.didWallet.managementAccount) return signInRef.current?.setOpen(true);
    console.log(wallet, 'wallet==');
    const originChainId = localStorage.getItem(storage.originChainId) as ChainId;

    const caHash = did.didWallet.caInfo[originChainId].caHash;
    const chainInfo = await getChainInfo(originChainId);
    const [portkeyContract, tokenContract] = await Promise.all(
      [chainInfo.caContractAddress, chainInfo.defaultToken.address].map(ca =>
        getContractBasic({
          contractAddress: ca,
          account: aelf.getWallet(did.didWallet.managementAccount?.privateKey || ''),
          rpcUrl: chainInfo.endPoint,
        }),
      ),
    );

    const result = await managerApprove({
      originChainId: originChainId,
      symbol: params.symbol,
      caHash,
      amount: params.amount,
      spender: params.spender,
      targetChainId: originChainId,
      networkType: 'TESTNET',
      dappInfo: {
        icon: 'https://icon.horse/icon/localhost:3000/50',
        href: 'http://localhost:3000',
        name: 'localhost',
      },
    });
    console.log(result, 'result===');

    const approveResult = await portkeyContract.callSendMethod('ManagerApprove', '', {
      caHash,
      spender: params.spender,
      symbol: result.symbol,
      amount: result.amount,
      guardiansApproved: result.guardiansApproved,
    });
    if (approveResult.error) throw approveResult.error;
  }, []);

  const getPortkeySDKProvider = useCallback(async () => {
    const wallet = await did.load('111111', storage.wallet);
    if (!wallet.didWallet.managementAccount) return signInRef.current?.setOpen(true);
    console.log(wallet, 'wallet==');
    const originChainId = localStorage.getItem(storage.originChainId) as ChainId;
    const caHash = did.didWallet.caInfo[originChainId].caHash;
    const chainInfo = await getChainInfo(originChainId);

    return {
      contractOptions: {
        account: aelf.getWallet(wallet.didWallet.managementAccount.privateKey),
        callType: 'ca' as any,
        caHash,
        caContractAddress: chainInfo.caContractAddress,
      },
      address: wallet.didWallet.aaInfo.accountInfo?.caAddress || '',
    };
  }, []);

  const getPortkeyProvider = useCallback(async () => {
    const provider = await detectProvider();
    if (!provider) return;
    // get chain provider
    const chainProvider = await provider.getChain('tDVW');
    const accountsResult = await provider.request({ method: 'requestAccounts' });
    const caAddress = accountsResult.tDVW?.[0];

    return { contractOptions: { chainProvider }, address: caAddress };
  }, []);

  const getNightElfProvider = useCallback(async () => {
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

    return {
      contractOptions: {
        aelfInstance: bridge,
        account: {
          address: address,
        },
      },
      address,
    };
  }, [aelfReact]);

  const getOptions: any = useCallback(async () => {
    if (walletType === WalletTypeEnum.unknown) throw 'unknown';

    switch (walletType) {
      case WalletTypeEnum.discover:
        return await getPortkeyProvider();
      case WalletTypeEnum.elf:
        return await getNightElfProvider();
      case WalletTypeEnum.aa:
        return await getPortkeySDKProvider();
      default:
        throw 'unknown';
    }
  }, [getNightElfProvider, getPortkeyProvider, getPortkeySDKProvider, walletType]);

  return (
    <main className=" min-h-screen flex-col items-center justify-between">
      <Button onClick={getBalance}>GetBalance</Button>
      <div>------</div>

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

      <Button disabled={!swapInfo || !routerInfo} onClick={onAwakenSwapPortkeySDK}>
        Awaken swap Portkey SDK
      </Button>
      <div>------</div>

      <Button onClick={getSupportTokenList}>getSupportTokenList</Button>

      <div>------</div>

      <Select
        onChange={setWalletType}
        options={[
          {
            value: WalletTypeEnum.unknown,
            label: 'select wallet',
          },
          {
            value: WalletTypeEnum.discover,
            label: 'Portkey',
          },
          {
            value: WalletTypeEnum.elf,
            label: 'NightElf',
          },
          {
            value: WalletTypeEnum.aa,
            label: 'Portkey SDK',
          },
        ]}
      />

      <div>------</div>

      <SignIn
        ref={signInRef}
        pin="111111"
        onFinish={wallet => {
          did.save('111111', storage.wallet);
          localStorage.setItem(storage.originChainId, wallet.chainId);
          signInRef.current?.setOpen(false);
          onAwakenSwapPortkeySDK();
        }}
      />
      {/* <Swap /> */}
      <Swap
        componentUiType={ComponentType.Web}
        awaken={{
          instance: awaken,
          tokenApprove: walletType === WalletTypeEnum.aa ? tokenApprove : undefined,
          getOptions,
        }}
      />
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
      <PortkeyProvider networkType={'TESTNET'}>
        <APP />
      </PortkeyProvider>
    </AElfReactProvider>
  );
}
