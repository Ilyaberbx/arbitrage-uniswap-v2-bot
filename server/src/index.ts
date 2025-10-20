import { pairsService } from "./services/PairsService";
import {
  ETH_TEST_STRATEGY,
  ARBITRUM_TEST_STRATEGY,
} from "./config/ArbitrageStrategiesConfig";

class ReservesFetcher {
  async fetchAllPairs() {
    const [ethPairsInfo, arbitrumPairsInfo] = await Promise.all([
      pairsService.getPairsInfo(
        ETH_TEST_STRATEGY.pairs,
        ETH_TEST_STRATEGY.chainName
      ),
      pairsService.getPairsInfo(
        ARBITRUM_TEST_STRATEGY.pairs,
        ARBITRUM_TEST_STRATEGY.chainName
      ),
    ]);
    console.log(ethPairsInfo);
    console.log(arbitrumPairsInfo);
  }
}

async function main() {
  const fetcher = new ReservesFetcher();
  await fetcher.fetchAllPairs();
}

if (require.main === module) {
  main().catch(console.error);
}
