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
]
