export interface IArbitrateStrategyAggregator {
  chain: string
  strategyAddresses: string[]
  update(): void
}
