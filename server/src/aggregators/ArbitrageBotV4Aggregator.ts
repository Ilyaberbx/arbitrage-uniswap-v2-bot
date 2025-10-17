import { IArbitrateBotAggregator } from '../interfaces/IArbitrateBotAggregator'

export class ArbitrageBotV4Aggregator implements IArbitrateBotAggregator {
  chain: string
  botsAddresses: string[]
  public update(): void {
    // Empty implementation for V4 aggregator
  }
}
