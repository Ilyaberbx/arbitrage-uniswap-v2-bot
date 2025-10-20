import { pairsService } from "./services/PairsService";
import { TRADING_PAIRS } from "./config/TradingPairs";

class ReservesFetcher {
  async fetchAllPairs() {
    const pairsInfo = await pairsService.getPairsInfo(TRADING_PAIRS);
    console.log(pairsInfo);
  }
}

async function main() {
  const fetcher = new ReservesFetcher();
  await fetcher.fetchAllPairs();
}

if (require.main === module) {
  main().catch(console.error);
}
