import { flashSwapService } from './services/FlashSwapService'
import { TRADING_PAIRS } from './config/TradingPairs'

class ReservesFetcher {
  async fetchAllPairs() {
    console.log('🧪 Fetching Real Reserves with Multicall Optimization...')
    const uniqueChains = [...new Set(TRADING_PAIRS.map((pair) => pair.chain))]

    for (const chainName of uniqueChains) {
      await this.fetchChainReserves(chainName)
    }
  }

  private async fetchChainReserves(chainName: string) {
    try {
      await flashSwapService.getAllReserves(chainName)
    } catch (error) {
      console.error(`❌ Failed to fetch reserves for ${chainName}:`, error)
    }
  }
}

async function main() {
  const fetcher = new ReservesFetcher()
  await fetcher.fetchAllPairs()
}

if (require.main === module) {
  main().catch(console.error)
}

export { flashSwapService }
