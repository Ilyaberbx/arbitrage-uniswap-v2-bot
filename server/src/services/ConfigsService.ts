import { ChainConfig } from "../types/ChainConfig";
import { ContractConfig } from "../types/ContractConfig";
import { getContractConfig } from "../constants/ArbitrageV2Constants";
import { getChainConfig } from "../constants/ChainConstants";
import { getAllChains } from "../constants/ChainConstants";

export class ConfigsService {
  getChain(chainName: string): ChainConfig | null {
    return getChainConfig(chainName);
  }

  getAllChains(): ChainConfig[] {
    return getAllChains();
  }

  getContract(chainName: string): ContractConfig | null {
    return getContractConfig(chainName);
  }
}
export const configsService = new ConfigsService();
