import { getContractBasic } from '@portkey/contracts';
import { aelf } from '@portkey/utils';
import AElf from 'aelf-sdk';

const commonWallet = AElf.wallet.createNewWallet();
const tokenContractName = 'AElf.ContractNames.Token';

export const getTokenContractAddress = async (rpcUrl: string) => {
  const instance = aelf.getAelfInstance(rpcUrl);
  const { GenesisContractAddress } = await instance.chain.getChainStatus();
  const sha256 = AElf.utils.sha256;

  const zeroContract = await getContractBasic({
    contractAddress: GenesisContractAddress,
    rpcUrl: rpcUrl,
    account: commonWallet,
  });

  const result = await zeroContract.callViewMethod('GetContractAddressByName', sha256(tokenContractName));

  return result.data;
};
