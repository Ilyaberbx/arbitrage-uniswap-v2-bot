import { IArbitrateBotAggregator } from '../interfaces/IArbitrateBotAggregator'

export class ArbitrageBotV2Aggregator implements IArbitrateBotAggregator {
  public chain: string
  public botsAddresses: string[]

  constructor(chain: string, botsAddresses: string[]) {
    this.chain = chain
    this.botsAddresses = botsAddresses
  }

  public update(): void {
    // Implementation for V2 aggregator update logic
  }
}
