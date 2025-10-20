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
  // Ethereum - Uniswap V2
  {
    address: "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",
    name: "USDC/WETH",
  },
  {
    address: "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11",
    name: "DAI/WETH",
  },
  {
    address: "0xBb2b8038a1640196FbE3e38816F3e67Cba72D940",
    name: "WBTC/WETH",
  },
  {
    address: "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852",
    name: "USDT/WETH",
  },
  {
    address: "0xa2107FA5B38d9bbd2C461D6EDf11B11A50F6b974",
    name: "LINK/WETH",
  },
  {
    address: "0xd3d2E2692501A5c9Ca623199D38826e513033a17",
    name: "UNI/WETH",
  },
  {
    address: "0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5",
    name: "DAI/USDC",
  },

  // Ethereum - SushiSwap
  {
    address: "0xCEfF51756c56CeFFCA006cD410B03FFC46dd3a58",
    name: "WBTC/WETH (Sushi)",
  },
  {
    address: "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0",
    name: "USDC/WETH (Sushi)",
  },
  {
    address: "0x06da0fd433C1A5d7a4faa01111c044910A184553",
    name: "USDT/WETH (Sushi)",
  },
  {
    address: "0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f",
    name: "DAI/WETH (Sushi)",
  },
];

export const ARBITRUM_TEST_PAIRS: TradingPair[] = [
  // Arbitrum - SushiSwap
  {
    address: "0x905dfCD5649217c42684f23958568e533C711Aa3",
    name: "WETH/USDC (Sushi)",
  },
  {
    address: "0x515e252b2b5c22b4b2b6Df66c2eBeeA871AA4d69",
    name: "WBTC/WETH (Sushi)",
  },
];

export const ARBITRUM_TEST_STRATEGY: ArbitrageStrategyPairs = {
  chainName: "arbitrum",
  pairs: ARBITRUM_TEST_PAIRS,
};

export const ETH_TEST_STRATEGY: ArbitrageStrategyPairs = {
  chainName: "ethereum",
  pairs: ETH_TEST_PAIRS,
};
