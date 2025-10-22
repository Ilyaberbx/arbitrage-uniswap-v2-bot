import { Address } from "viem";
import { PairInfo } from "../types/AMMV2Config";
import { UNISWAP_V2_PAIR_ABI } from "../constants/AbiConstants";
import { TradingPair } from "../types/ArbitrageV2Config";
import { viemClientsService } from "./ViemClientsService";
import { erc20Abi } from "viem";

export class PairsService {
  public async getPairsInfo(
    tradingPairs: TradingPair[],
    chainName: string
  ): Promise<PairInfo[]> {
    const pairsInfo: PairInfo[] = [];

    const client = viemClientsService.getPublicClient(chainName);
    const pairsContracts = tradingPairs.flatMap((pair) =>
      this.getPairContracts(pair)
    );
    const pairsResults = await client.multicall({
      contracts: pairsContracts,
    });

    const pairStep = pairsContracts.length / tradingPairs.length;

    for (let i = 0; i < pairsResults.length; i += pairStep) {
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
        const pair = tradingPairs[i / pairStep];

        pairsInfo.push({
          pairAddress: pair.address,
          token0: {
            address: token0Result,
            symbol: "",
            decimals: 0,
          },
          token1: {
            address: token1Result,
            symbol: "",
            decimals: 0,
          },
          reserve0: reserve0,
          reserve1: reserve1,
          lastUpdatedTimestamp: lastUpdatedTimestamp,
        });
      } else {
        console.error(
          `Error getting pair info for ${tradingPairs[i / pairStep].address}:`,
          pairsResults[i].error
        );
      }
    }

    const tokensInfoContracts = pairsInfo.flatMap((pair) =>
      this.getTokensDecimals(pair.token0.address, pair.token1.address)
    );
    const tokensInfoResults = await client.multicall({
      contracts: tokensInfoContracts,
    });

    const tokenStep = tokensInfoResults.length / pairsInfo.length;

    for (let i = 0; i < tokensInfoResults.length; i += tokenStep) {
      const pair = pairsInfo[i / tokenStep];
      const token0DecimalsResult = tokensInfoResults[i].result as number;
      const token1DecimalsResult = tokensInfoResults[i + 1].result as number;
      const token0SymbolResult = tokensInfoResults[i + 2].result as string;
      const token1SymbolResult = tokensInfoResults[i + 3].result as string;

      pair.token0.decimals = token0DecimalsResult;
      pair.token1.decimals = token1DecimalsResult;
      pair.token0.symbol = token0SymbolResult;
      pair.token1.symbol = token1SymbolResult;
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
      {
        address: token0Address,
        abi: erc20Abi,
        functionName: "symbol",
      },
      {
        address: token1Address,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ];
  }
}

export const pairsService = new PairsService();
