import { PairInfo } from "../config/AMMConfig";
import ArbitrageMath from "../utils/ArbitrageMath";

export class FlashSwapArbitrageService {
  public async processPairs(pairs: PairInfo[]): Promise<void> {
    for (const pair of pairs) {
      for (const otherPair of pairs) {
        if (pair.pairAddress === otherPair.pairAddress) {
          continue;
        }

        const optimalAmount = ArbitrageMath.calculateOptimalArbitrageAmount(
          pair,
          otherPair
        );

        console.log(
          `Optimal arbitrage amount between ${pair.pairAddress} and ${otherPair.pairAddress} is ${optimalAmount}`
        );
      }
    }
  }
}

export const flashSwapArbitrageService = new FlashSwapArbitrageService();
