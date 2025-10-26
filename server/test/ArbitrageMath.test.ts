import ArbitrageMath from "../src/utils/ArbitrageMath";

describe("Arbitrage Math : calculateArbitrageOptimalAmount", () => {
  it("Has to be zero if there is no arbitrage opportunity", () => {
    const reserveAIn = ArbitrageMath.normalize(10000n, 6);
    const reserveAOut = ArbitrageMath.normalize(10000000000000000n, 18);
    const reserveBIn = ArbitrageMath.normalize(10000n, 6);
    const reserveBOut = ArbitrageMath.normalize(10000000000000000n, 18);

    const optimalArbitrageAmount =
      ArbitrageMath.calculateArbitrageOptimalAmount(
        reserveAIn,
        reserveAOut,
        reserveBIn,
        reserveBOut
      );

    expect(optimalArbitrageAmount).toBe(0n);
  });

  it("Has to be greater than zero if there is a big arbitrage opportunity", () => {
    const reserveAIn = ArbitrageMath.normalize(9000n, 6);
    const reserveAOut = ArbitrageMath.normalize(10000000000000000n, 18);
    const reserveBIn = ArbitrageMath.normalize(10000n, 6);
    const reserveBOut = ArbitrageMath.normalize(10000000000000000n, 18);

    const optimalArbitrageAmount =
      ArbitrageMath.calculateArbitrageOptimalAmount(
        reserveAIn,
        reserveAOut,
        reserveBIn,
        reserveBOut
      );

    console.log(optimalArbitrageAmount);
    expect(optimalArbitrageAmount).toBeGreaterThan(0n);
  });

  it("Has to be greater than zero if there is a small arbitrage opportunity", () => {
    const reserveAIn = ArbitrageMath.normalize(9930n, 6);
    const reserveAOut = ArbitrageMath.normalize(10000000000000000n, 18);
    const reserveBIn = ArbitrageMath.normalize(10000n, 6);
    const reserveBOut = ArbitrageMath.normalize(10000000000000000n, 18);

    const optimalArbitrageAmount =
      ArbitrageMath.calculateArbitrageOptimalAmount(
        reserveAIn,
        reserveAOut,
        reserveBIn,
        reserveBOut
      );

    console.log(optimalArbitrageAmount);
    expect(optimalArbitrageAmount).toBeGreaterThan(0n);
  });
});
