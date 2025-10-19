export interface ContractConfig {
  address: string
  chainId: number
  abi: readonly any[]
}

// ABI for the ArbitrageBotUniswapV2 contract (flashSwapArbitrage function)
export const ARBITRAGE_BOT_ABI = [
  {
    "type": "function",
    "name": "flashSwapArbitrage",
    "inputs": [
      {
        "name": "pair0",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "pair1", 
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "isZeroForOne",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "amountIn",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "minProfit",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "ProfitMade",
    "inputs": [
      {
        "name": "caller",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "token",
        "type": "address", 
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "profit",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
] as const

// Mock contract addresses for each chain
export const ARBITRAGE_BOT_CONTRACTS: Record<string, ContractConfig> = {
  ethereum: {
    address: '0x1234567890123456789012345678901234567890',
    chainId: 1,
    abi: ARBITRAGE_BOT_ABI
  },
  polygon: {
    address: '0x2345678901234567890123456789012345678901',
    chainId: 137,
    abi: ARBITRAGE_BOT_ABI
  },
  arbitrum: {
    address: '0x3456789012345678901234567890123456789012',
    chainId: 42161,
    abi: ARBITRAGE_BOT_ABI
  }
}

export const getContractConfig = (chainName: string): ContractConfig | null => {
  return ARBITRAGE_BOT_CONTRACTS[chainName] || null
}