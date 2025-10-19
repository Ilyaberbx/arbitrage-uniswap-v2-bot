export interface ChainConfig {
  chainId: number
  name: string
  rpcUrl: string
  isTestnet: boolean
}

export const MOCK_CHAINS: Record<string, ChainConfig> = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: 'https://eth.llamarpc.com',
    isTestnet: false
  },
  polygon: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon.llamarpc.com',
    isTestnet: false
  },
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arbitrum.llamarpc.com',
    isTestnet: false
  }
}

export const getChainConfig = (chainName: string): ChainConfig | null => {
  return MOCK_CHAINS[chainName] || null
}

export const getAllChains = (): ChainConfig[] => {
  return Object.values(MOCK_CHAINS)
}