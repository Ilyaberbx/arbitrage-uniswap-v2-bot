import { Chain, Hex } from "viem";

export interface ChainConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  isTestnet: boolean;
  viemChain: Chain;
  walletPrivateKey: Hex;
}
