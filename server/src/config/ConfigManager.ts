import { ChainConfig, getChainConfig, getAllChains } from "./ChainConfig";
import { ContractConfig, getContractConfig } from "./ContractConfig";

export class ConfigManager {
  /**
   * Get chain configuration by name
   */
  getChain(chainName: string): ChainConfig | null {
    return getChainConfig(chainName);
  }
  /**
   * Get all available chains
   */
  getAllChains(): ChainConfig[] {
    return getAllChains();
  }

  /**
   * Get contract configuration for a specific chain
   */
  getContract(chainName: string): ContractConfig | null {
    return getContractConfig(chainName);
  }
}
export const configManager = new ConfigManager();
