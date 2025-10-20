import { Address } from "viem";

export interface TradingPair {
  address: Address;
  name: string;
}

export interface ArbitrageStrategyPairs {
  chainName: string;
  pairs: TradingPair[];
}

export const ETH_TEST_PAIRS: TradingPair[] = [
  // Ethereum - SushiSwap
  {
    address: "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0",
    name: "USDC/WETH (Sushi)",
  },
  {
    address: "0x06da0fd433C1A5d7a4faa01111c044910A184553",
    name: "USDT/WETH (Sushi)",
  },
];

export const ETH_TEST_STRATEGY: ArbitrageStrategyPairs = {
  chainName: "ethereum",
  pairs: ETH_TEST_PAIRS,
};
