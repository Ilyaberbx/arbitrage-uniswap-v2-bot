import { Address } from "viem";

export interface TokenInfo {
  address: Address;
  symbol: string;
  decimals: number;
}

export interface PairInfo {
  pairAddress: Address;
  token0: TokenInfo;
  token1: TokenInfo;
  reserve0: bigint;
  reserve1: bigint;
  lastUpdatedTimestamp: number;
}
