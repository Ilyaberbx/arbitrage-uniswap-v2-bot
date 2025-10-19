import { ChainConfig, getChainConfig, getAllChains } from './ChainConfig'
import { AMMConfig, getAMMsForChain, getPairByAddress, PairInfo } from './AMMConfig'
import { ContractConfig, getContractConfig } from './ContractConfig'

export class ConfigManager {
  /**
   * Get chain configuration by name
   */
  getChain(chainName: string): ChainConfig | null {
    return getChainConfig(chainName)
  }

  /**
   * Get all available chains
   */
  getAllChains(): ChainConfig[] {
    return getAllChains()
  }

  /**
   * Get contract configuration for a specific chain
   */
  getContract(chainName: string): ContractConfig | null {
    return getContractConfig(chainName)
  }

  /**
   * Get pair information by address
   */
  getPair(chainName: string, pairAddress: string): PairInfo | null {
    return getPairByAddress(chainName, pairAddress)
  }
}
export const configManager = new ConfigManager()
