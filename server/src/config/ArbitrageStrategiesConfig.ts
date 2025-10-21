import { Address } from "viem";

export interface TradingPair {
  address: Address;
  name: string;
}

export interface ArbitrageStrategyPairs {
  chainName: string;
  pairs: TradingPair[];
}

export interface FlashSwapParams {
  pair0: Address;
  pair1: Address;
  isZeroForOne: boolean;
  amountIn: bigint;
  minProfit: bigint;
}

export const ETH_TEST_PAIRS: TradingPair[] = [
  {
    address: "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0",
    name: "USDC/WETH (SushiSwap)",
  },
  {
    address: "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
    name: "USDC/WETH (SushiSwap)",
  },
  {
    address: "0x2e8135be71230c6b1b4045696d41c09db0414226",
    name: "USDC/WETH (PancakeSwap)",
  },
];

export const ARBITRUM_TEST_PAIRS: TradingPair[] = [
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

export const ETH_TEST_STRATEGY: ArbitrageStrategyPairs = {
  chainName: "ethereum",
  pairs: ETH_TEST_PAIRS,
};

export const ARBITRUM_TEST_STRATEGY: ArbitrageStrategyPairs = {
  chainName: "arbitrum",
  pairs: ARBITRUM_TEST_PAIRS,
};
