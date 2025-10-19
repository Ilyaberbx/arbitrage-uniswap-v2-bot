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

// Contract addresses will be added when contracts are deployed
export const ARBITRAGE_BOT_CONTRACTS: Record<string, ContractConfig> = {
  // ethereum: { address: '0x...', chainId: 1, abi: ARBITRAGE_BOT_ABI },
  // polygon: { address: '0x...', chainId: 137, abi: ARBITRAGE_BOT_ABI },  
  // arbitrum: { address: '0x...', chainId: 42161, abi: ARBITRAGE_BOT_ABI }
}

// Uniswap V2 Pair ABI for getReserves function
export const UNISWAP_V2_PAIR_ABI = [
  {
    "type": "function",
    "name": "getReserves",
    "inputs": [],
    "outputs": [
      {
        "name": "reserve0",
        "type": "uint112",
        "internalType": "uint112"
      },
      {
        "name": "reserve1", 
        "type": "uint112",
        "internalType": "uint112"
      },
      {
        "name": "blockTimestampLast",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "stateMutability": "view"
  }
] as const

export const getContractConfig = (chainName: string): ContractConfig | null => {
  return ARBITRAGE_BOT_CONTRACTS[chainName] || null
}