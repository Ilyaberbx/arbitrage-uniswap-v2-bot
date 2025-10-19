import { IArbitrateStrategyAggregator } from '../interfaces/IArbitrateStrategyAggregator'

export class ArbitrageStrategyV3Aggregator implements IArbitrateStrategyAggregator {
  chain: string
  strategyAddresses: string[]
  public update(): void {
    // Empty implementation for V3 aggregator
  }
}
