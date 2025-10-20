import { Address } from "viem";
import { PairInfo } from "../config/AMMConfig";
import { UNISWAP_V2_PAIR_ABI } from "../config/ContractConfig";
import { TradingPair } from "../config/TradingPairs";
import { viemClientsService } from "./ViemClientsService";
import { erc20Abi } from "viem";

export class PairsService {
  public async getPairsInfo(tradingPairs: TradingPair[]): Promise<PairInfo[]> {
    const pairsInfo: PairInfo[] = [];

    const pairsByChain = new Map<string, TradingPair[]>();

    for (const pair of tradingPairs) {
      const chainPairs = pairsByChain.get(pair.chain) || [];
      chainPairs.push(pair);
      pairsByChain.set(pair.chain, chainPairs);
    }

    for (const chain of pairsByChain.keys()) {
      const chainPairs = pairsByChain.get(chain) || [];
      const client = viemClientsService.getClient(chain);
      const pairsContracts = chainPairs.flatMap((pair) =>
        this.getPairContracts(pair)
      );
      const pairsResults = await client.multicall({
        contracts: pairsContracts,
      });
      for (let i = 0; i < pairsResults.length; i += pairsContracts.length) {
        if (pairsResults[i].status === "success" && pairsResults[i].result) {
          const reservesResult = pairsResults[i].result as [
            bigint,
            bigint,
            number
          ];
          const token0Result = pairsResults[i + 1].result as Address;
          const token1Result = pairsResults[i + 2].result as Address;
          const reserve0 = reservesResult[0];
          const reserve1 = reservesResult[1];
          const lastUpdatedTimestamp = reservesResult[2];
          const pair = chainPairs[i];

          pairsInfo.push({
            pairAddress: pair.address,
            token0: {
              address: token0Result,
              symbol: "Token0",
              decimals: 18,
            },
            token1: {
              address: token1Result,
              symbol: "Token1",
              decimals: 18,
            },
            reserve0: reserve0,
            reserve1: reserve1,
            lastUpdatedTimestamp: lastUpdatedTimestamp,
          });
        } else {
          console.error(
            `Error getting pair info for ${chainPairs[i].address}:`,
            pairsResults[i].error
          );
        }
      }

      const tokensDecimalsContracts = pairsInfo.flatMap((pair) =>
        this.getTokensDecimals(pair.token0.address, pair.token1.address)
      );
      const tokensDecimalsResults = await client.multicall({
        contracts: tokensDecimalsContracts,
      });
      for (let i = 0; i < pairsInfo.length; i++) {
        const pair = pairsInfo[i];
        const token0DecimalsResult = tokensDecimalsResults[i].result as number;
        const token1DecimalsResult = tokensDecimalsResults[i + 1]
          .result as number;
        pair.token0.decimals = token0DecimalsResult;
        pair.token1.decimals = token1DecimalsResult;
      }
    }

    return pairsInfo;
  }

  private getPairContracts(pair: TradingPair) {
    return [
      {
        address: pair.address as Address,
        abi: UNISWAP_V2_PAIR_ABI,
        functionName: "getReserves",
      },
      {
        address: pair.address as Address,
        abi: UNISWAP_V2_PAIR_ABI,
        functionName: "token0",
      },
      {
        address: pair.address as Address,
        abi: UNISWAP_V2_PAIR_ABI,
        functionName: "token1",
      },
    ];
  }

  private getTokensDecimals(token0Address: Address, token1Address: Address) {
    return [
      {
        address: token0Address,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address: token1Address,
        abi: erc20Abi,
        functionName: "decimals",
      },
    ];
  }
}

export const pairsService = new PairsService();
