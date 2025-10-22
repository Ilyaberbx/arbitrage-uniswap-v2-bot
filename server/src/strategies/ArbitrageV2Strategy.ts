import { ArbitrageStrategyPairs } from "../types/ArbitrageV2Config";
import { IArbitrageStrategy } from "./IArbitrageStrategy";
import { pairsService } from "../services/PairsService";
import { flashSwapArbitrageService } from "../services/FlashSwapArbitrageService";

export class ArbitrageV2Strategy implements IArbitrageStrategy {
  constructor(private readonly config: ArbitrageStrategyPairs) {}
  async tick(): Promise<void> {
    const pairsInfo = await pairsService.getPairsInfo(
      this.config.pairs,
      this.config.chainName
    );

    const flashSwapParams =
      flashSwapArbitrageService.tryFindOpportunity(pairsInfo);

    if (flashSwapParams === undefined) {
      console.log("No V2 arbitrage opportunity found");
      return;
    }

    console.log("Executing V2 flash swap with params:", flashSwapParams);
    await flashSwapArbitrageService.executeFlashSwap(
      flashSwapParams,
      this.config.chainName
    );
    console.log("V2 flash swap executed");
  }
}
