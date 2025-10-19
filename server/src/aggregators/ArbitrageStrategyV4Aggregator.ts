import { IArbitrateStrategyAggregator as IArbitrateStrategyAggregator } from '../interfaces/IArbitrateStrategyAggregator'

export class ArbitrageStrategyV4Aggregator implements IArbitrateStrategyAggregator {
  chain: string
  strategyAddresses: string[]
  public update(): void {
    // Empty implementation for V4 aggregator
  }
}
