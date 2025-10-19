export interface TradingPair {
  chain: string
  address: string
  name: string
}

export const TRADING_PAIRS: TradingPair[] = [
  // Ethereum pairs
  {
    chain: 'ethereum',
    address: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
    name: 'USDC/WETH',
  },
  {
    chain: 'ethereum',
    address: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
    name: 'DAI/WETH',
  },
  {
    chain: 'ethereum',
    address: '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852',
    name: 'WETH/USDT',
  },
  {
    chain: 'ethereum',
    address: '0xBb2b8038a1640196FbE3e38816F3e67Cba72D940',
    name: 'WBTC/WETH',
  },
  {
    chain: 'ethereum',
    address: '0x004375Dff511095CC5A197A54140a24eFEF3A416',
    name: 'WBTC/USDC',
  },
  // Polygon pairs (QuickSwap V2)
  {
    chain: 'polygon',
    address: '0x6e7a5FAFcec6BB1e78bAE2A1F0B612012BF14827',
    name: 'USDC/WETH',
  },
  {
    chain: 'polygon',
    address: '0xF6422B997c7F54D1c6a6e103bcb1499EeA0a7046',
    name: 'WETH/USDT',
  },
  // Arbitrum pairs (SushiSwap)
  {
    chain: 'arbitrum',
    address: '0x905dfcd5649217c42684f23958568e533c711aa3',
    name: 'USDC/WETH',
  },
  {
    chain: 'arbitrum',
    address: '0x515e252b2b5c22b4b2b6Df66c2eBeeA871AA4d69',
    name: 'WETH/USDT',
  },
]
