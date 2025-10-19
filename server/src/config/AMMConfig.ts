// AMMConfig is kept for future real implementation
export interface TokenInfo {
  address: string
  symbol: string
  decimals: number
}

export interface PairInfo {
  pairAddress: string
  token0: TokenInfo
  token1: TokenInfo
  factoryAddress: string
}