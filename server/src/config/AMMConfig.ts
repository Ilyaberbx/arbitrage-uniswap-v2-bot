export interface TokenInfo {
  address: string
  symbol: string
  decimals: number
}

export interface PairInfo {
  pairAddress: string
  token0: TokenInfo
  token1: TokenInfo
  reserve0: bigint
  reserve1: bigint
  factoryAddress: string
}

export interface AMMConfig {
  name: string
  chainId: number
  pairs: PairInfo[]
}

// Mock token addresses - using common test tokens
const MOCK_TOKENS = {
  WETH: { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH', decimals: 18 },
  USDC: { address: '0xA0b86a33E6417B31C5Ff9a4b3d66E6D04EEc8B09', symbol: 'USDC', decimals: 6 },
  DAI: { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI', decimals: 18 }
}

export const MOCK_AMMS: Record<string, AMMConfig[]> = {
  ethereum: [
    {
      name: 'UniswapV2',
      chainId: 1,
      pairs: [
        {
          pairAddress: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
          token0: MOCK_TOKENS.USDC,
          token1: MOCK_TOKENS.WETH,
          reserve0: BigInt('100000000000'), // 100k USDC
          reserve1: BigInt('50000000000000000000'), // 50 ETH
          factoryAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
        }
      ]
    },
    {
      name: 'SushiSwap',
      chainId: 1,
      pairs: [
        {
          pairAddress: '0x397FF1542f962076d0BFE58eA045FfA2d347ACa0',
          token0: MOCK_TOKENS.USDC,
          token1: MOCK_TOKENS.WETH,
          reserve0: BigInt('95000000000'), // 95k USDC (slight price difference)
          reserve1: BigInt('50000000000000000000'), // 50 ETH
          factoryAddress: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac'
        }
      ]
    },
    {
      name: 'PancakeSwap',
      chainId: 1,
      pairs: [
        {
          pairAddress: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
          token0: MOCK_TOKENS.WETH,
          token1: MOCK_TOKENS.DAI,
          reserve0: BigInt('30000000000000000000'), // 30 ETH
          reserve1: BigInt('60000000000000000000000'), // 60k DAI
          factoryAddress: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'
        }
      ]
    }
  ],
  polygon: [
    {
      name: 'QuickSwap',
      chainId: 137,
      pairs: [
        {
          pairAddress: '0x6e7a5FAFcec6BB1e78bAE2A1F0B612012BF14827',
          token0: MOCK_TOKENS.USDC,
          token1: MOCK_TOKENS.WETH,
          reserve0: BigInt('80000000000'), // 80k USDC
          reserve1: BigInt('50000000000000000000'), // 50 ETH
          factoryAddress: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32'
        }
      ]
    },
    {
      name: 'SushiSwap',
      chainId: 137,
      pairs: [
        {
          pairAddress: '0xcd353F79d9FADe311fC3119B841e1f456b54e858',
          token0: MOCK_TOKENS.USDC,
          token1: MOCK_TOKENS.WETH,
          reserve0: BigInt('85000000000'), // 85k USDC
          reserve1: BigInt('50000000000000000000'), // 50 ETH
          factoryAddress: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4'
        }
      ]
    },
    {
      name: 'ApeSwap',
      chainId: 137,
      pairs: [
        {
          pairAddress: '0x5b13B583D4317aB15186Ed660A1E4C65C10da659',
          token0: MOCK_TOKENS.WETH,
          token1: MOCK_TOKENS.DAI,
          reserve0: BigInt('25000000000000000000'), // 25 ETH
          reserve1: BigInt('50000000000000000000000'), // 50k DAI
          factoryAddress: '0xCf083Be4164828f00cAE704EC15a36D711491284'
        }
      ]
    }
  ],
  arbitrum: [
    {
      name: 'SushiSwap',
      chainId: 42161,
      pairs: [
        {
          pairAddress: '0x905dfCD5649217c42684f23958568e533C711Aa3',
          token0: MOCK_TOKENS.USDC,
          token1: MOCK_TOKENS.WETH,
          reserve0: BigInt('90000000000'), // 90k USDC
          reserve1: BigInt('50000000000000000000'), // 50 ETH
          factoryAddress: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4'
        }
      ]
    },
    {
      name: 'Camelot',
      chainId: 42161,
      pairs: [
        {
          pairAddress: '0x84652bb2539513BAf36e225c930Fdd8eaa63CE27',
          token0: MOCK_TOKENS.USDC,
          token1: MOCK_TOKENS.WETH,
          reserve0: BigInt('105000000000'), // 105k USDC
          reserve1: BigInt('50000000000000000000'), // 50 ETH
          factoryAddress: '0x6EcCab422D763aC031210895C81787E87B91425'
        }
      ]
    },
    {
      name: 'Uniswap',
      chainId: 42161,
      pairs: [
        {
          pairAddress: '0x17c14D2c404D167802b16C450d3c99F88F2c4F4d',
          token0: MOCK_TOKENS.WETH,
          token1: MOCK_TOKENS.DAI,
          reserve0: BigInt('40000000000000000000'), // 40 ETH
          reserve1: BigInt('80000000000000000000000'), // 80k DAI
          factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984'
        }
      ]
    }
  ]
}

export const getAMMsForChain = (chainName: string): AMMConfig[] => {
  return MOCK_AMMS[chainName] || []
}

export const getPairByAddress = (chainName: string, pairAddress: string): PairInfo | null => {
  const amms = getAMMsForChain(chainName)
  for (const amm of amms) {
    const pair = amm.pairs.find(p => p.pairAddress.toLowerCase() === pairAddress.toLowerCase())
    if (pair) return pair
  }
  return null
}