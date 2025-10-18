export interface IArbitrateBotAggregator {
  chain: string
  botsAddresses: string[]
  update(): void
}
