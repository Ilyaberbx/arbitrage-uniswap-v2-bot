import { createPublicClient, http, Address } from 'viem'
import { FlashSwapRequest, CallResult } from '../types/FlashSwapTypes'
import { configManager } from '../config/ConfigManager'

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
      transport: http(chain.rpcUrl),
    })
  }

  /**
   * Calculate USD values based on pair reserves
   */
  private calculateUSDValues(
    reserve0: bigint,
    reserve1: bigint,
    token0Decimals: number,
    token1Decimals: number,
    isToken0USD: boolean
  ) {
    // Convert reserves to decimal format
    const reserve0Decimal = Number(reserve0) / Math.pow(10, token0Decimals)
    const reserve1Decimal = Number(reserve1) / Math.pow(10, token1Decimals)

    if (isToken0USD) {
      // Token0 is USD (like USDC), so token1 price = reserve0 / reserve1
      const token1Price = reserve0Decimal / reserve1Decimal
      return {
        reserve0USD: reserve0Decimal,
        reserve1USD: reserve1Decimal * token1Price,
        token1Price,
      }
    } else {
      // Token1 is USD (like USDC), so token0 price = reserve1 / reserve0
      const token0Price = reserve1Decimal / reserve0Decimal
      return {
        reserve0USD: reserve0Decimal * token0Price,
        reserve1USD: reserve1Decimal,
        token0Price,
      }
    }
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

      // Determine token decimals and USD token based on pair name
      let token0Decimals = 18,
        token1Decimals = 18,
        isToken0USD = false

      if (pairName?.includes('USDC')) {
        if (pairName.startsWith('USDC')) {
          token0Decimals = 6 // USDC has 6 decimals
          isToken0USD = true
        } else {
          token1Decimals = 6 // USDC has 6 decimals
          isToken0USD = false
        }
      } else if (pairName?.includes('USDT')) {
        if (pairName.startsWith('USDT')) {
          token0Decimals = 6 // USDT has 6 decimals
          isToken0USD = true
        } else {
          token1Decimals = 6 // USDT has 6 decimals
          isToken0USD = false
        }
      } else if (pairName?.includes('WBTC')) {
        if (pairName.startsWith('WBTC')) {
          token0Decimals = 8 // WBTC has 8 decimals
        } else {
          token1Decimals = 8 // WBTC has 8 decimals
        }
      }

      // Calculate USD values
      const usdValues = this.calculateUSDValues(reserve0, reserve1, token0Decimals, token1Decimals, isToken0USD)

      console.log(`\n[${chainName.toUpperCase()}] Reserves for ${pairName || pairAddress}:`)
      console.log(
        `  Reserve0: ${reserve0.toString()} (~$${usdValues.reserve0USD.toLocaleString('en-US', {
          maximumFractionDigits: 2,
        })})`
      )
      console.log(
        `  Reserve1: ${reserve1.toString()} (~$${usdValues.reserve1USD.toLocaleString('en-US', {
          maximumFractionDigits: 2,
        })})`
      )

      if (usdValues.token0Price) {
        console.log(`  Token0 Price: ~$${usdValues.token0Price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`)
      }
      if (usdValues.token1Price) {
        console.log(`  Token1 Price: ~$${usdValues.token1Price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`)
      }

      const dateTime = new Date(timestamp * 1000).toISOString()
      console.log(`  Last Updated: ${dateTime} (${timestamp})`)

      return {
        reserve0,
        reserve1,
        timestamp,
        pairAddress,
        usdValues,
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
