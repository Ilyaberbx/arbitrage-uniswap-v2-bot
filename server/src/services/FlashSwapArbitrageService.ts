import { PairInfo } from "../types/AMMV2Config";
import { FlashSwapParams } from "../types/ArbitrageV2Config";
import { configsService } from "../services/ConfigsService";
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

        return undefined;
      }
    }

    return undefined;
  }

  public async executeFlashSwap(
    flashSwapParams: FlashSwapParams,
    chainName: string
  ): Promise<void> {
    const walletClient = viemClientsService.getWalletClient(chainName);
    const publicClient = viemClientsService.getPublicClient(chainName);
    const chainConfig = configsService.getChain(chainName);
    const contractConfig = configsService.getContract(chainName);

    if (!contractConfig) {
      throw new Error(`Contract not found for chain ${chainName}`);
    }
    if (!chainConfig) {
      throw new Error(`Chain not found for chain ${chainName}`);
    }
    if (!walletClient.account) {
      throw new Error(`Account not found for chain ${chainName}`);
    }

    const { request } = await publicClient.simulateContract({
      address: contractConfig.address,
      chain: chainConfig.viemChain,
      abi: contractConfig.abi,
      account: walletClient.account,
      functionName: "flashSwapArbitrage",
      args: [
        flashSwapParams.pair0,
        flashSwapParams.pair1,
        flashSwapParams.isZeroForOne,
        flashSwapParams.amountIn,
        flashSwapParams.minProfit,
      ],
    });

    const txHash = await walletClient.writeContract(request);

    console.log(`Transaction sent: ${txHash} on chain ${chainName}`);
  }

  private displayOpportunity(flashSwapParams: FlashSwapParams) {
    console.log(`Opportunity found: ${flashSwapParams}`);
  }
}

export const flashSwapArbitrageService = new FlashSwapArbitrageService();
