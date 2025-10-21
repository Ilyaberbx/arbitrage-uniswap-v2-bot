import { ChainConfig } from "../types/ChainConfig";
import { mainnet, polygon, arbitrum } from "viem/chains";
import { Hex } from "viem";

export const CHAINS: Record<string, ChainConfig> = {
  ethereum: {
    chainId: 1,
    name: "Ethereum",
    rpcUrl: "https://eth.llamarpc.com",
    isTestnet: false,
    viemChain: mainnet,
    walletPrivateKey: (process.env.EVM_WALLET_PRIVATE_KEY as Hex) || "",
  },
  polygon: {
    chainId: 137,
    name: "Polygon",
    rpcUrl: "https://polygon-rpc.com",
    isTestnet: false,
    viemChain: polygon,
    walletPrivateKey: (process.env.EVM_WALLET_PRIVATE_KEY as Hex) || "",
  },
  arbitrum: {
    chainId: 42161,
    name: "Arbitrum",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    isTestnet: false,
    viemChain: arbitrum,
    walletPrivateKey: (process.env.EVM_WALLET_PRIVATE_KEY as Hex) || "",
  },
};

export const getChainConfig = (chainName: string): ChainConfig | null => {
  return CHAINS[chainName] || null;
};

export const getAllChains = (): ChainConfig[] => {
  return Object.values(CHAINS);
};
