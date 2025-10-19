import { IArbitrateStrategyAggregator } from '../interfaces/IArbitrateStrategyAggregator'

export class ArbitrageStrategyV2Aggregator implements IArbitrateStrategyAggregator {
  public chain: string
  public strategyAddresses: string[]

  constructor(chain: string, botsAddresses: string[]) {
    this.chain = chain
    this.strategyAddresses = botsAddresses
  }

  public update(): void {
    // Implementation for V2 aggregator update logic
  }
}
