import { pairsService } from "./services/PairsService";
import { flashSwapArbitrageService } from "./services/FlashSwapArbitrageService";
import { ETH_TEST_STRATEGY } from "./config/ArbitrageStrategiesConfig";

class ReservesFetcher {
  async fetchAllPairs() {
    const [ethPairsInfo] = await Promise.all([
      pairsService.getPairsInfo(
        ETH_TEST_STRATEGY.pairs,
        ETH_TEST_STRATEGY.chainName
      ),
    ]);

    await flashSwapArbitrageService.processPairs(ethPairsInfo);
  }
}

async function main() {
  const fetcher = new ReservesFetcher();
  await fetcher.fetchAllPairs();
}

if (require.main === module) {
  main().catch(console.error);
}
