import { PairInfo } from "../src/types/AMMV2Config";
import ArbitrageMath from "../src/utils/ArbitrageMath";

describe("Arbitrage Math : calculateArbitrageOptimalAmount", () => {
  it("Has to be zero if there is no arbitrage opportunity", () => {
    const reserveAIn = 1000000000000000000000000n;
    const reserveAOut = 1000000000000000000000000n;
    const reserveBIn = 1000000000000000000000000n;
    const reserveBOut = 1000000000000000000000000n;
    const feeNumerator = 997n;
    const feeDenominator = 1000n;

    const optimalArbitrageAmount =
      ArbitrageMath.calculateArbitrageOptimalAmount(
        reserveAIn,
        reserveAOut,
        reserveBIn,
        reserveBOut,
        feeNumerator,
        feeDenominator
      );

    expect(optimalArbitrageAmount).toBe(0n);
  });
});

describe("Arbitrage Math : calculateArbitrageOptimalAmount", () => {
  it("Has to be greater than zero if there is an arbitrage opportunity", () => {
    const reserveAIn = 999000000000000000000000n;
    const reserveAOut = 1000000000000000000000000n;
    const reserveBIn = 1000000000000000000000000n;
    const reserveBOut = 1100000000000000000000000n;
    const feeNumerator = 997n;
    const feeDenominator = 1000n;

    const optimalArbitrageAmount =
      ArbitrageMath.calculateArbitrageOptimalAmount(
        reserveAIn,
        reserveAOut,
        reserveBIn,
        reserveBOut,
        feeNumerator,
        feeDenominator
      );

    expect(optimalArbitrageAmount).toBeGreaterThan(0n);
  });
});

describe("Arbitrage Math : assessArbitrageOpportunity", () => {
  it("Has to return zero if there is no arbitrage opportunity", () => {
    const pair0: PairInfo = {
      pairAddress: "0x1234567890123456789012345678901234567890",
      token0: {
        address: "0x1000000000000000000000000000000000000000",
        symbol: "USDC",
        decimals: 6,
      },
      token1: {
        address: "0x0000000000000000000000000000000000000000",
        symbol: "WETH",
        decimals: 18,
      },
      reserve0: 1000000000000000000000000n,
      reserve1: 1000000000000000000000000n,
      lastUpdatedTimestamp: 1719000000,
    };
    const pair1: PairInfo = {
      pairAddress: "0x0123456789012345678901234567890123456789",
      token0: {
        address: "0x1000000000000000000000000000000000000000",
        symbol: "USDC",
        decimals: 6,
      },
      token1: {
        address: "0x0000000000000000000000000000000000000000",
        symbol: "WETH",
        decimals: 18,
      },
      reserve0: 1000000000000000000000000n,
      reserve1: 1000000000000000000000000n,
      lastUpdatedTimestamp: 1719000000,
    };

    const result = ArbitrageMath.assessArbitrageOpportunity(pair0, pair1);
    expect(result.optimalArbitrageAmount).toBe(0n);
  });
});

describe("Arbitrage Math : assessArbitrageOpportunity", () => {
  it("Has to return the optimal arbitrage amount and correct isZeroForOne and pairs if there is an arbitrage opportunity (token1 -> token0)", () => {
    const pair0: PairInfo = {
      pairAddress: "0x1234567890123456789012345678901234567890",
      token0: {
        address: "0x1000000000000000000000000000000000000000",
        symbol: "USDC",
        decimals: 6,
      },
      token1: {
        address: "0x0000000000000000000000000000000000000000",
        symbol: "WETH",
        decimals: 18,
      },
      reserve0: 1000000000000000000000000n,
      reserve1: 1000000000000000000000000n,
      lastUpdatedTimestamp: 1719000000,
    };
    const pair1: PairInfo = {
      pairAddress: "0x0123456789012345678901234567890123456789",
      token0: {
        address: "0x1000000000000000000000000000000000000000",
        symbol: "USDC",
        decimals: 6,
      },
      token1: {
        address: "0x0000000000000000000000000000000000000000",
        symbol: "WETH",
        decimals: 18,
      },
      reserve0: 1000000000000000000000000n,
      reserve1: 900000000000000000000000n,
      lastUpdatedTimestamp: 1719000000,
    };

    const result = ArbitrageMath.assessArbitrageOpportunity(pair0, pair1);
    expect(result.optimalArbitrageAmount).toBeGreaterThan(0n);
    expect(result.isZeroForOne).toBe(false);
    expect(result.pair0).toBe(pair1);
    expect(result.pair1).toBe(pair0);
  });
});

describe("Arbitrage Math : assessArbitrageOpportunity", () => {
  it("Has to return the optimal arbitrage amount and correct isZeroForOne and pairs if there is an arbitrage opportunity (token0 -> token1)", () => {
    const pair0: PairInfo = {
      pairAddress: "0x1234567890123456789012345678901234567890",
      token0: {
        address: "0x1000000000000000000000000000000000000000",
        symbol: "USDC",
        decimals: 6,
      },
      token1: {
        address: "0x0000000000000000000000000000000000000000",
        symbol: "WETH",
        decimals: 18,
      },
      reserve0: 900000000000000000000000n,
      reserve1: 1000000000000000000000000n,
      lastUpdatedTimestamp: 1719000000,
    };
    const pair1: PairInfo = {
      pairAddress: "0x0123456789012345678901234567890123456789",
      token0: {
        address: "0x1000000000000000000000000000000000000000",
        symbol: "USDC",
        decimals: 6,
      },
      token1: {
        address: "0x0000000000000000000000000000000000000000",
        symbol: "WETH",
        decimals: 18,
      },
      reserve0: 1000000000000000000000000n,
      reserve1: 1000000000000000000000000n,
      lastUpdatedTimestamp: 1719000000,
    };

    const result = ArbitrageMath.assessArbitrageOpportunity(pair0, pair1);
    expect(result.optimalArbitrageAmount).toBeGreaterThan(0n);
    expect(result.isZeroForOne).toBe(true);
    expect(result.pair0).toBe(pair0);
    expect(result.pair1).toBe(pair1);
  });
});

describe("Arbitrage Math : assessArbitrageOpportunity", () => {
  it("Has to return the optimal arbitrage amount and correct isZeroForOne and pairs if there is an arbitrage opportunity if tokens do not have same order", () => {
    const pair0: PairInfo = {
      pairAddress: "0x0123456789012345678901234567890123456789",
      token0: {
        address: "0x1000000000000000000000000000000000000000",
        symbol: "USDC",
        decimals: 6,
      },
      token1: {
        address: "0x0000000000000000000000000000000000000000",
        symbol: "WETH",
        decimals: 18,
      },
      reserve0: 1000000000000000000000000n,
      reserve1: 1000000000000000000000000n,
      lastUpdatedTimestamp: 1719000000,
    };

    const pair1: PairInfo = {
      pairAddress: "0x1234567890123456789012345678901234567890",
      token0: {
        address: "0x0000000000000000000000000000000000000000",
        symbol: "WETH",
        decimals: 18,
      },
      token1: {
        address: "0x1000000000000000000000000000000000000000",
        symbol: "USDC",
        decimals: 6,
      },
      reserve0: 900000000000000000000000n,
      reserve1: 1000000000000000000000000n,
      lastUpdatedTimestamp: 1719000000,
    };

    const result = ArbitrageMath.assessArbitrageOpportunity(pair0, pair1);
    expect(result.optimalArbitrageAmount).toBeGreaterThan(0n);
    expect(result.isZeroForOne).toBe(true);
    expect(result.pair0).toBe(pair1);
    expect(result.pair1).toBe(pair0);
  });
});
