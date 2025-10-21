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
