export interface TradingPair {
  chain: string
  address: string
  name: string
}

export const TRADING_PAIRS: TradingPair[] = [
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
]
