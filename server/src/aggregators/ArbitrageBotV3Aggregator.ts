import { IArbitrateBotAggregator } from '../interfaces/IArbitrateBotAggregator'

export class ArbitrageBotV3Aggregator implements IArbitrateBotAggregator {
  chain: string
  botsAddresses: string[]
  public update(): void {
    // Empty implementation for V3 aggregator
  }
}
