import { Address } from "viem";

// AMMConfig is kept for future real implementation
export interface TokenInfo {
  address: Address;
  symbol: string;
  decimals: number;
}

export interface PairInfo {
  pairAddress: string;
  token0: TokenInfo;
  token1: TokenInfo;
  reserve0: bigint;
  reserve1: bigint;
  lastUpdatedTimestamp: number;
}
