import {
  ArbitrageStrategyPairs,
  TradingPair,
} from "../types/ArbitrageV2Config";
import { ContractConfig } from "../types/ContractConfig";
import { ARBITRAGE_BOT_UNISWAP_V2_ABI } from "./AbiConstants";

export const ARBITRUM_V2_PAIRS: TradingPair[] = [
  {
    address: "0x905dfCD5649217c42684f23958568e533C711Aa3",
    name: "USDC/WETH (SushiSwap)",
  },
  {
    address: "0x84652bb2539513BAf36e225c930Fdd8eaa63CE27",
    name: "USDC/WETH (Camelot)",
  },
  {
    address: "0xC31E54c7a869B9FcBEcc14363CF510d1c41fa443",
    name: "USDC/WETH (Zyberswap)",
  },
];
export const ARBITRUM_V2_STRATEGY: ArbitrageStrategyPairs = {
  chainName: "arbitrum",
  pairs: ARBITRUM_V2_PAIRS,
};
export const ARBITRAGE_BOT_V2_CONTRACTS: Record<string, ContractConfig> = {
  ethereum: {
    address: "0x3691D652b6d8A6650FB35b8Ea028C88470C0E690",
    abi: ARBITRAGE_BOT_UNISWAP_V2_ABI,
  },
};
export const getContractConfig = (chainName: string): ContractConfig | null => {
  return ARBITRAGE_BOT_V2_CONTRACTS[chainName] || null;
};
