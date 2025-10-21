import { ARBITRUM_V2_STRATEGY } from "../constants/ArbitrageV2Constants";
import { ArbitrageV2Strategy } from "../strategies/ArbitrageV2Strategy";
import { IArbitrageStrategy } from "../strategies/IArbitrageStrategy";

export class StrategiesFactoryService {
  public createStrategies(): IArbitrageStrategy[] {
    return [new ArbitrageV2Strategy(ARBITRUM_V2_STRATEGY)];
  }
}

export const strategiesFactoryService = new StrategiesFactoryService();
