import { pairsService } from "./services/PairsService";
import { flashSwapArbitrageService } from "./services/FlashSwapArbitrageService";
import { ARBITRUM_TEST_STRATEGY } from "./config/ArbitrageStrategiesConfig";

class ReservesFetcher {
  async fetchAllPairs() {
    const [arbitrumPairsInfo] = await Promise.all([
      pairsService.getPairsInfo(
        ARBITRUM_TEST_STRATEGY.pairs,
        ARBITRUM_TEST_STRATEGY.chainName
      ),
    ]);

    const flashSwapParams =
      flashSwapArbitrageService.tryFindOpportunity(arbitrumPairsInfo);

    const hasOpportunity = flashSwapParams !== undefined;
    if (!hasOpportunity) {
      console.log("No opportunity found");
      return;
    }

    console.log("Executing flash swap...");
    flashSwapArbitrageService.executeFlashSwap(
      flashSwapParams,
      ARBITRUM_TEST_STRATEGY.chainName
    );
    console.log("Flash swap executed");
  }
}

async function main() {
  const fetcher = new ReservesFetcher();
  await fetcher.fetchAllPairs();
}

if (require.main === module) {
  main().catch(console.error);
}
