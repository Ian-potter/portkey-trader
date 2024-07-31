'use client';
import loginConfig from '@/constants/config/login.config';
import { APP_NAME, WEBSITE_ICON } from '@/constants/website';
import { SignInDesignEnum, WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';
import { IConfigProps } from '@aelf-web-login/wallet-adapter-bridge';
import { NightElfWallet } from '@aelf-web-login/wallet-adapter-night-elf';
import { PortkeyAAWallet } from '@aelf-web-login/wallet-adapter-portkey-aa';
import { PortkeyDiscoverWallet } from '@aelf-web-login/wallet-adapter-portkey-discover';
import { init, useConnectWallet, WebLoginProvider } from '@aelf-web-login/wallet-adapter-react';
import { AwakenSwapper, TBestRoutersAmountInfo, TContractOption } from '@portkey/trader-core';
import { RouteType } from '@portkey/trader-services';
import { Button } from 'antd';
import React, { useCallback, useState } from 'react';
import { ChainId } from '@portkey/types';
import { getChainInfo } from '@portkey/did-ui-react';
const {
  CHAIN_ID,
  CONNECT_SERVER,
  GRAPHQL_SERVER,
  NETWORK_TYPE,
  RPC_SERVER_AELF,
  RPC_SERVER_TDVV,
  RPC_SERVER_TDVW,
  PORTKEY_SERVER_URL,
} = loginConfig;

const didConfig = {
  graphQLUrl: GRAPHQL_SERVER,
  connectUrl: CONNECT_SERVER,
  serviceUrl: PORTKEY_SERVER_URL,

  requestDefaults: {
    baseURL: PORTKEY_SERVER_URL,
    timeout: 30000,
  },
  socialLogin: {
    Portkey: {
      websiteName: APP_NAME,
      websiteIcon: WEBSITE_ICON,
    },
  },
};

const baseConfig: IConfigProps['baseConfig'] = {
  showVconsole: true,
  networkType: NETWORK_TYPE,
  chainId: CHAIN_ID,
  keyboard: true,
  noCommonBaseModal: false,
  design: SignInDesignEnum.CryptoDesign, // "SocialDesign" | "CryptoDesign" | "Web2Design"
  titleForSocialDesign: 'Crypto wallet',
  iconSrcForSocialDesign:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIHZpZXdCb3g9IjAgMCA1NiA1NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9IkVsZiBFeHBsb3JlciI+CjxyZWN0IHdpZHRoPSI1NiIgaGVpZ2h0PSI1NiIgZmlsbD0id2hpdGUiLz4KPHBhdGggaWQ9IlNoYXBlIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMwLjAwMDMgMTEuODQyQzMzLjEwNjkgMTEuODQyIDM1LjYyNTIgOS4zMjM3MSAzNS42MjUyIDYuMjE3MTlDMzUuNjI1MiAzLjExMDY4IDMzLjEwNjkgMC41OTIzNDYgMzAuMDAwMyAwLjU5MjM0NkMyNi44OTM4IDAuNTkyMzQ2IDI0LjM3NTUgMy4xMTA2OCAyNC4zNzU1IDYuMjE3MTlDMjQuMzc1NSA5LjMyMzcxIDI2Ljg5MzggMTEuODQyIDMwLjAwMDMgMTEuODQyWk01NS40MDkzIDI4LjAzNzhDNTUuNDA5MyAzNC4zNTc5IDUwLjI4NTggMzkuNDgxNCA0My45NjU3IDM5LjQ4MTRDMzcuNjQ1NSAzOS40ODE0IDMyLjUyMiAzNC4zNTc5IDMyLjUyMiAyOC4wMzc4QzMyLjUyMiAyMS43MTc2IDM3LjY0NTUgMTYuNTk0MSA0My45NjU3IDE2LjU5NDFDNTAuMjg1OCAxNi41OTQxIDU1LjQwOTMgMjEuNzE3NiA1NS40MDkzIDI4LjAzNzhaTTM1LjYyNTIgNDkuODU4MkMzNS42MjUyIDUyLjk2NDggMzMuMTA2OSA1NS40ODMxIDMwLjAwMDMgNTUuNDgzMUMyNi44OTM4IDU1LjQ4MzEgMjQuMzc1NSA1Mi45NjQ4IDI0LjM3NTUgNDkuODU4MkMyNC4zNzU1IDQ2Ljc1MTcgMjYuODkzOCA0NC4yMzM0IDMwLjAwMDMgNDQuMjMzNEMzMy4xMDY5IDQ0LjIzMzQgMzUuNjI1MiA0Ni43NTE3IDM1LjYyNTIgNDkuODU4MlpNMS4xOTczMyAxMi4yM0MtMC40NTEzMzEgMTYuNTk0MSAxLjg3NjE5IDIxLjU0MDEgNi4yNDAzIDIzLjE4ODdDOS4xNDk3IDI0LjI1NTUgMTIuMjUzMSAyMy42NzM2IDE0LjQ4MzYgMjEuODMxQzE2LjUyMDIgMjAuMzc2MyAxOS4xMzg3IDE5Ljg5MTQgMjEuNjYwMSAyMC44NjEyQzIzLjMwODggMjEuNDQzMSAyNC41Njk1IDIyLjUwOTkgMjUuNDQyNCAyMy44Njc2TDI1LjUzOTMgMjQuMDYxNUMyNS45MjczIDI0LjY0MzQgMjYuNTA5MSAyNS4yMjUzIDI3LjI4NSAyNS40MTkzQzI5LjAzMDYgMjYuMDk4MSAzMS4wNjcyIDI1LjEyODMgMzEuNjQ5MSAyMy4zODI3QzMyLjMyOCAyMS42MzcgMzEuMzU4MiAxOS42MDA1IDI5LjYxMjUgMTkuMDE4NkMyOC44MzY3IDE4LjcyNzYgMjguMDYwOCAxOC43Mjc2IDI3LjI4NSAxOS4wMTg2QzI1LjczMzMgMTkuNTAzNSAyMy45ODc3IDE5LjUwMzUgMjIuMzM5IDE4LjkyMTZDMTkuOTE0NSAxOC4wNDg4IDE4LjI2NTggMTYuMTA5MiAxNy41ODcgMTMuODc4NkwxNy40OSAxMy42ODQ3QzE3LjQ5IDEzLjU4NzcgMTcuNDkgMTMuNDkwNyAxNy4zOTMgMTMuNDkwN1YxMy4yOTY4QzE2LjcxNDIgMTAuNTgxMyAxNC44NzE1IDguMjUzNzggMTIuMDU5MSA3LjI4Mzk4QzcuNjk1IDUuNTM4MzQgMi43NDkwMSA3Ljc2ODg4IDEuMTk3MzMgMTIuMjNaTTYuMjQwMyAzMi44ODY4QzEuODc2MTkgMzQuNTM1NCAtMC40NTEzMzEgMzkuNDgxNCAxLjE5NzMzIDQzLjg0NTVDMi44NDU5OSA0OC4zMDY2IDcuNjk1IDUwLjUzNzIgMTIuMDU5MSA0OC43OTE1QzE0Ljg3MTUgNDcuODIxNyAxNi43MTQyIDQ1LjQ5NDIgMTcuMzkzIDQyLjc3ODdWNDIuNTg0OEMxNy40OSA0Mi41ODQ4IDE3LjQ5IDQyLjQ4NzggMTcuNDkgNDIuMzkwOEwxNy41ODcgNDIuMTk2OUMxOC4yNjU4IDM5Ljk2NjMgMTkuOTE0NSAzOC4wMjY3IDIyLjMzOSAzNy4xNTM5QzIzLjk4NzcgMzYuNTcyIDI1LjczMzMgMzYuNTcyIDI3LjI4NSAzNy4wNTY5QzI4LjA2MDggMzcuMzQ3OSAyOC44MzY3IDM3LjM0NzkgMjkuNjEyNSAzNy4wNTY5QzMxLjM1ODIgMzYuNDc1IDMyLjMyOCAzNC40Mzg1IDMxLjY0OTEgMzIuNjkyOEMzMS4wNjcyIDMwLjk0NzIgMjkuMDMwNiAyOS45Nzc0IDI3LjI4NSAzMC42NTYyQzI2LjUwOTEgMzAuODUwMiAyNS45MjczIDMxLjQzMjEgMjUuNTM5MyAzMi4wMTRMMjUuNDQyNCAzMi4yMDc5QzI0LjU2OTUgMzMuNTY1NiAyMy4zMDg4IDM0LjYzMjQgMjEuNjYwMSAzNS4yMTQzQzE5LjEzODcgMzYuMTg0MSAxNi41MjAyIDM1LjY5OTIgMTQuNDgzNiAzNC4yNDQ1QzEyLjI1MzEgMzIuNDAxOSA5LjE0OTcgMzEuODIgNi4yNDAzIDMyLjg4NjhaIiBmaWxsPSIjMjY2Q0QzIi8+CjwvZz4KPC9zdmc+Cg==',
};

const wallets = [
  new PortkeyAAWallet({
    appName: APP_NAME,
    chainId: CHAIN_ID,
    autoShowUnlock: true,
    noNeedForConfirm: false,
  }),
  new PortkeyDiscoverWallet({
    networkType: NETWORK_TYPE,
    chainId: CHAIN_ID,
    autoRequestAccount: true,
    autoLogoutOnDisconnected: true,
    autoLogoutOnNetworkMismatch: true,
    autoLogoutOnAccountMismatch: true,
    autoLogoutOnChainMismatch: true,
  }),
  new NightElfWallet({
    chainId: CHAIN_ID,
    appName: APP_NAME,
    connectEagerly: true,
    useMultiChain: false,
    defaultRpcUrl: RPC_SERVER_AELF,
    nodes: {
      AELF: {
        chainId: 'AELF',
        rpcUrl: RPC_SERVER_AELF,
      },
      tDVW: {
        chainId: 'tDVW',
        rpcUrl: RPC_SERVER_TDVW,
      },
      tDVV: {
        chainId: 'tDVV',
        rpcUrl: RPC_SERVER_TDVV,
      },
    },
  }),
];

const config: IConfigProps = {
  didConfig,
  baseConfig,
  wallets,
};

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

const APP = () => {
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

  const { connectWallet, callSendMethod, walletType, isConnected, walletInfo, disConnectWallet } = useConnectWallet();

  const onAwakenSwapHandler = useCallback(async () => {
    if (!isConnected) return await connectWallet();
    const connectInfo = walletInfo;
    console.log(connectInfo, 'connectInfo==');
    if (!swapInfo) return;
    if (!connectInfo) return;

    const chainProvider = await connectInfo.extraInfo?.provider?.getChain('tDVW');
    const bridge = await connectInfo.extraInfo?.nightElfInfo?.aelfBridges?.['tDVW'];
    const portkeyInfo = connectInfo.extraInfo?.portkeyInfo;
    const contractOption: any = {
      account: {
        address: connectInfo?.address,
      },
    };
    // account: aelf.getWallet(wallet.didWallet.managementAccount.privateKey),
    //     callType: 'ca',
    //     caHash,
    //     caContractAddress: chainInfo.caContractAddress,
    if (chainProvider) contractOption.chainProvider = chainProvider;
    if (bridge) contractOption.aelfInstance = bridge;
    if (portkeyInfo) {
      const chainInfo = await getChainInfo(portkeyInfo.chainId);

      contractOption.account = portkeyInfo.walletInfo;
      contractOption.callType = 'ca';
      contractOption.caHash = portkeyInfo.caInfo.caHash;
      contractOption.caContractAddress = chainInfo.caContractAddress;
    }

    console.log(chainProvider, bridge, 'bridge===');

    const result = await awaken.swap({
      routeType: ROUTE_TYPE,
      // amountOutMin: swapperParams.amountOut,
      // amountIn: swapperParams,
      // amountOut: swapInfo.,
      symbol: swapperParams.symbolIn,
      amountIn: swapperParams.amountIn,
      slippageTolerance: '0.005',
      bestSwapTokensInfo: swapInfo,
      contractOption: contractOption,
      userAddress: connectInfo?.address,
      // toAddress: caAddress,
      tokenApprove: async params => {
        return await callSendMethod({
          contractAddress: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
          methodName: 'Approve',
          args: params,
          chainId: 'tDVW',
        });
      },
    });
    setSwapInfo(undefined);
    setRouterInfo(undefined);
    console.log(result, 'result==');
  }, [callSendMethod, connectWallet, isConnected, swapInfo, walletInfo]);

  return (
    <div>
      <div>
        walletType: {localStorage.getItem('connectedWallet') ?? 'unknown'}
        <Button
          onClick={async () => {
            // localStorage.removeItem('connectedWallet');
            // localStorage.setItem('connectedWallet', 'PortkeyAA');
            // connectWallet();
            await disConnectWallet();
            await connectWallet();
          }}>
          change wallet
        </Button>
      </div>

      <Button onClick={onAwakenSwapper}>awaken</Button>
      <div>------</div>

      <Button disabled={!routerInfo} onClick={onAwakenCheckBestRouters}>
        checkBestRouters Awaken
      </Button>

      <div>------</div>

      <Button disabled={!swapInfo || !routerInfo} onClick={onAwakenSwapHandler}>
        Awaken swap
      </Button>

      <div>------</div>
    </div>
  );
};

export default function Home() {
  const bridgeAPI = init(config);

  return (
    <WebLoginProvider bridgeAPI={bridgeAPI}>
      <APP />
    </WebLoginProvider>
  );
}
