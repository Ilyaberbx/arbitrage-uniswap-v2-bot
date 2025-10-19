import { Address } from 'viem'

export interface FlashSwapParams {
  pair0: Address
  pair1: Address
  isZeroForOne: boolean
  amountIn: bigint
  minProfit: bigint
}

export interface FlashSwapRequest {
  chainName: string
  pair0Address: Address
  pair1Address: Address
  isZeroForOne: boolean
  amountIn: string | bigint
  minProfit: string | bigint
}

export interface FlashSwapResult {
  success: boolean
  transactionHash?: string
  profit?: bigint
  error?: string
  gasEstimate?: bigint
}

interface Pair {
  address: Address
  amm: string
  token0Symbol: string
  token1Symbol: string
  reserve0: bigint
  reserve1: bigint
}

export interface ArbitrageOpportunity {
  chainName: string
  pair0: Pair
  pair1: Pair
  estimatedProfit: bigint
  optimalAmountIn: bigint
}

export interface CallResult {
  data: `0x${string}`
  success: boolean
  error?: string
}
