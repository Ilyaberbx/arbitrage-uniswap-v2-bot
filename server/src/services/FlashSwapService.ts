import { createPublicClient, http, Address } from 'viem'
import { FlashSwapRequest, CallResult } from '../types/FlashSwapTypes'
import { configManager } from '../config/ConfigManager'
import { TRADING_PAIRS } from '../config/TradingPairs'
import { UNISWAP_V2_PAIR_ABI } from '../config/ContractConfig'

export class FlashSwapService {
  /**
   * Create a public client for the specified chain
   */
  private createClient(chainName: string) {
    const chain = configManager.getChain(chainName)
    if (!chain) {
      throw new Error(`Chain '${chainName}' not found`)
    }

    return createPublicClient({
      chain: chain.viemChain,
      transport: http(chain.rpcUrl),
    })
  }

  /**
   * Extract token information from pair name (standardized to end with WETH)
   */
  private getTokenInfo(pairName?: string): {
    token0Decimals: number
    token1Decimals: number
    isToken0USD: boolean
  } {
    let token0Decimals = 18,
      token1Decimals = 18, // WETH always has 18 decimals (token1)
      isToken0USD = false

    // All pairs now end with WETH, so we only check the first token
    if (pairName?.startsWith('USDC')) {
      token0Decimals = 6 // USDC has 6 decimals
      isToken0USD = true
    } else if (pairName?.startsWith('USDT')) {
      token0Decimals = 6 // USDT has 6 decimals
      isToken0USD = true
    } else if (pairName?.startsWith('WBTC')) {
      token0Decimals = 8 // WBTC has 8 decimals
      isToken0USD = false // WBTC is not USD
    } else if (pairName?.startsWith('DAI')) {
      token0Decimals = 18 // DAI has 18 decimals
      isToken0USD = true // DAI is USD-pegged
    }

    return { token0Decimals, token1Decimals, isToken0USD }
  }

  /**
   * Calculate simple price ratios and human-readable reserves
   */
  private calculateReserveInfo(
    reserve0: bigint,
    reserve1: bigint,
    token0Decimals: number,
    token1Decimals: number,
    pairName: string
  ) {
    // Convert reserves to human-readable format
    const reserve0Readable = Number(reserve0) / Math.pow(10, token0Decimals)
    const reserve1Readable = Number(reserve1) / Math.pow(10, token1Decimals)

    // Extract token symbols from pair name (e.g., "USDC/WETH" -> ["USDC", "WETH"])
    const [token0Symbol, token1Symbol] = pairName.split('/') || ['Token0', 'Token1']

    // Calculate price ratios
    const token0PriceInToken1 = reserve1Readable / reserve0Readable // How much token1 per 1 token0
    const token1PriceInToken0 = reserve0Readable / reserve1Readable // How much token0 per 1 token1

    return {
      reserve0Readable,
      reserve1Readable,
      token0Symbol,
      token1Symbol,
      token0PriceInToken1,
      token1PriceInToken0,
    }
  }

  /**
   * Get reserves for all trading pairs using multicall (optimized)
   */
  async getAllReserves(chainName: string) {
    try {
      const client = this.createClient(chainName)
      const chainPairs = TRADING_PAIRS.filter((pair) => pair.chain === chainName)

      console.log(`\n[${chainName.toUpperCase()}] Fetching reserves for ${chainPairs.length} pairs using multicall...`)

      // Build multicall contracts array
      const contracts = chainPairs.map((pair) => ({
        address: pair.address as Address,
        abi: UNISWAP_V2_PAIR_ABI,
        functionName: 'getReserves',
      }))

      // Execute multicall
      const results = await client.multicall({
        contracts,
      })

      // Process each result
      for (let i = 0; i < results.length; i++) {
        const result = results[i]
        const pair = chainPairs[i]

        if (result.status === 'success' && result.result) {
          const [reserve0, reserve1, timestamp] = result.result as [bigint, bigint, number]
          this.displayReserves(pair.name, reserve0, reserve1, timestamp, chainName)
        } else {
          console.error(`❌ Failed to fetch reserves for ${pair.name}:`, result.error)
        }
      }
    } catch (error) {
      console.error(`Error in multicall for ${chainName}:`, error)
      throw error
    }
  }

  /**
   * Display formatted reserves (extracted for reuse)
   */
  private displayReserves(pairName: string, reserve0: bigint, reserve1: bigint, timestamp: number, chainName: string) {
    // Extract token information using the shared method
    const { token0Decimals, token1Decimals } = this.getTokenInfo(pairName)

    // Calculate reserve info with accurate prices
    const reserveInfo = this.calculateReserveInfo(reserve0, reserve1, token0Decimals, token1Decimals, pairName)

    console.log(`\n[${chainName.toUpperCase()}] ${pairName}:`)
    console.log(
      `  ${reserveInfo.token0Symbol} Reserves: ${reserveInfo.reserve0Readable.toLocaleString('en-US', {
        maximumFractionDigits: 2,
      })} ${reserveInfo.token0Symbol}`
    )
    console.log(
      `  ${reserveInfo.token1Symbol} Reserves: ${reserveInfo.reserve1Readable.toLocaleString('en-US', {
        maximumFractionDigits: 2,
      })} ${reserveInfo.token1Symbol}`
    )
    console.log(
      `  Price: 1 ${reserveInfo.token0Symbol} = ${reserveInfo.token0PriceInToken1.toLocaleString('en-US', {
        maximumFractionDigits: 6,
      })} ${reserveInfo.token1Symbol}`
    )
    console.log(
      `  Price: 1 ${reserveInfo.token1Symbol} = ${reserveInfo.token1PriceInToken0.toLocaleString('en-US', {
        maximumFractionDigits: 6,
      })} ${reserveInfo.token0Symbol}`
    )

    const dateTime = new Date(timestamp * 1000).toISOString()
    console.log(`  Last Updated: ${dateTime}`)
  }

  /**
   * Get real reserves from a Uniswap V2 pair contract
   */
  async getReserves(chainName: string, pairAddress: string, pairName?: string) {
    try {
      const client = this.createClient(chainName)

      const result = await client.call({
        to: pairAddress as Address,
        data: '0x0902f1ac', // getReserves() function selector
      })

      // Decode the result manually (reserve0: 112 bits, reserve1: 112 bits, timestamp: 32 bits)
      const data = result.data
      if (!data || data === '0x') {
        throw new Error('No data returned from getReserves call')
      }

      // Remove 0x prefix and parse hex data
      const hex = data.slice(2)
      const reserve0 = BigInt('0x' + hex.slice(0, 64))
      const reserve1 = BigInt('0x' + hex.slice(64, 128))
      // Timestamp is the last 32 bits (8 hex chars), but we need to account for padding
      const timestamp = parseInt(hex.slice(-8), 16)

      // Use the displayReserves method for consistent formatting
      this.displayReserves(pairName || pairAddress, reserve0, reserve1, timestamp, chainName)

      return {
        reserve0,
        reserve1,
        timestamp,
        pairAddress,
      }
    } catch (error) {
      console.error(`Error getting reserves for ${pairAddress}:`, error)
      throw error
    }
  }

  /**
   * A flash swap call using viem's call action
   */
  async flashSwap(request: FlashSwapRequest): Promise<CallResult> {
    //TODO: implement
    return {} as CallResult
  }

  /**
   * Calculate optimal arbitrage amount using the constant product formula
   */
  calculateOptimalAmount(reserve0A: bigint, reserve1A: bigint, reserve0B: bigint, reserve1B: bigint): bigint {
    //TODO: implement
    return 0n
  }
}
export const flashSwapService = new FlashSwapService()
