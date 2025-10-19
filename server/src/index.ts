import { flashSwapService } from './services/FlashSwapService'
import { TRADING_PAIRS } from './config/TradingPairs'

class ReservesFetcher {
  async fetchAllPairs() {
    console.log('🧪 Fetching Real Reserves...')

    for (const pair of TRADING_PAIRS) {
      await this.fetchPairReserves(pair.chain, pair.address, pair.name)
    }
  }

  private async fetchPairReserves(chain: string, address: string, name: string) {
    try {
      await flashSwapService.getReserves(chain, address, name)
    } catch (error) {
      console.error(`❌ Failed to fetch reserves for ${name}:`, error)
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
