export interface IArbitrageStrategy {
  tick(): Promise<void>;
}
