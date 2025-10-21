import { PairInfo } from "../config/AMMConfig";
import { FlashSwapParams } from "../config/ArbitrageStrategiesConfig";
import { configManager } from "../config/ConfigManager";
import { ARBITRAGE_BOT_ABI } from "../config/ContractConfig";
import ArbitrageMath from "../utils/ArbitrageMath";
import { viemClientsService } from "./ViemClientsService";

export class FlashSwapArbitrageService {
  public tryFindOpportunity(pairs: PairInfo[]): FlashSwapParams | undefined {
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      for (let j = i + 1; j < pairs.length; j++) {
        const otherPair = pairs[j];
        if (pair.pairAddress === otherPair.pairAddress) {
          continue;
        }

        const result = ArbitrageMath.assessArbitrageOpportunity(
          pair,
          otherPair
        );

        if (result.optimalArbitrageAmount <= 0) {
          continue;
        }

        const flashSwapParams: FlashSwapParams = {
          pair0: pair.pairAddress,
          pair1: otherPair.pairAddress,
          isZeroForOne: result.isZeroForOne,
          amountIn: result.optimalArbitrageAmount,
          minProfit: 0n,
        };

        this.displayOpportunity(flashSwapParams);

        return flashSwapParams;
      }
    }

    return undefined;
  }

  public async executeFlashSwap(
    flashSwapParams: FlashSwapParams,
    chainName: string
  ): Promise<void> {
    const client = viemClientsService.getWalletClient(chainName);
    const chainConfig = configManager.getChain(chainName);
    const contractConfig = configManager.getContract(chainName);

    if (!contractConfig) {
      throw new Error(`Contract not found for chain ${chainName}`);
    }
    if (!chainConfig) {
      throw new Error(`Chain not found for chain ${chainName}`);
    }
    if (!client.account) {
      throw new Error(`Account not found for chain ${chainName}`);
    }

    const txHash = await client.writeContract({
      address: contractConfig.address,
      chain: chainConfig.viemChain,
      abi: ARBITRAGE_BOT_ABI,
      functionName: "flashSwapArbitrage",
      account: client.account,
      args: [
        flashSwapParams.pair0,
        flashSwapParams.pair1,
        flashSwapParams.isZeroForOne,
        flashSwapParams.amountIn,
        flashSwapParams.minProfit,
      ],
    });

    console.log(`Transaction sent: ${txHash} on chain ${chainName}`);
  }

  private displayOpportunity(flashSwapParams: FlashSwapParams) {
    console.log(`Opportunity found: ${flashSwapParams}`);
  }
}

export const flashSwapArbitrageService = new FlashSwapArbitrageService();
