import { PairInfo } from "../src/types/AMMV2Config";
import ArbitrageMath from "../src/utils/ArbitrageMath";
import { BigMath } from "../src/utils/BigMath";

describe("Arbitrage Math : calculateArbitrageOptimalAmount", () => {
  it("Has to be zero if there is no arbitrage opportunity", () => {
    const reserveAIn = BigMath.normalize(10000n, 6);
    const reserveAOut = BigMath.normalize(10000000000000000n, 18);
    const reserveBIn = BigMath.normalize(10000n, 6);
    const reserveBOut = BigMath.normalize(10000000000000000n, 18);

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
    const reserveAIn = BigMath.normalize(9000n, 6);
    const reserveAOut = BigMath.normalize(10000000000000000n, 18);
    const reserveBIn = BigMath.normalize(10000n, 6);
    const reserveBOut = BigMath.normalize(10000000000000000n, 18);

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
    const reserveAIn = BigMath.normalize(9930n, 6);
    const reserveAOut = BigMath.normalize(10000000000000000n, 18);
    const reserveBIn = BigMath.normalize(10000n, 6);
    const reserveBOut = BigMath.normalize(10000000000000000n, 18);

    const optimalArbitrageAmount =
      ArbitrageMath.calculateArbitrageOptimalAmount(
        reserveAIn,
        reserveAOut,
        reserveBIn,
        reserveBOut
      );

    expect(optimalArbitrageAmount).toBeGreaterThan(0n);
  });
});

describe("Arbitrage Math : tryFindArbitrageOpportunity", () => {
  it("Has to be undefined if there is no arbitrage opportunity", () => {
    const pair0: PairInfo = {
      pairAddress: "0x1234567890123456789012345678901234567890",
      token0: {
        address: "0x1000000000000000000000000000000000000000",
        decimals: 6,
        symbol: "USDC",
      },
      token1: {
        address: "0x2000000000000000000000000000000000000000",
        decimals: 18,
        symbol: "WETH",
      },
      reserve0: 10000n,
      reserve1: 10000000000000000n,
      lastUpdatedTimestamp: 0,
    };

    const pair1: PairInfo = {
      pairAddress: "0x2234567890123456789012345678901234567890",
      token0: {
        address: "0x1000000000000000000000000000000000000000",
        decimals: 6,
        symbol: "USDC",
      },
      token1: {
        address: "0x2000000000000000000000000000000000000000",
        decimals: 18,
        symbol: "WETH",
      },
      reserve0: 10000n,
      reserve1: 10000000000000000n,
      lastUpdatedTimestamp: 0,
    };

    const flashSwapParams = ArbitrageMath.tryFindArbitrageOpportunity(
      pair0,
      pair1
    );

    expect(flashSwapParams).toBeUndefined();
  });
  it("Has to return the flash swap params with the correct values if there is a arbitrage opportunity", () => {
    const pair0: PairInfo = {
      pairAddress: "0x905dfCD5649217c42684f23958568e533C711Aa3",
      token0: {
        address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        symbol: "WETH",
        decimals: 18,
      },
      token1: {
        address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        symbol: "USDC",
        decimals: 6,
      },
      reserve0: 104848013689724003908n,
      reserve1: 435344233503n,
      lastUpdatedTimestamp: 1761565390,
    };

    const pair1: PairInfo = {
      pairAddress: "0x84652bb2539513BAf36e225c930Fdd8eaa63CE27",
      token0: {
        address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        symbol: "WETH",
        decimals: 18,
      },
      token1: {
        address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        symbol: "USDC",
        decimals: 6,
      },
      reserve0: 28334535066090891264n,
      reserve1: 117613645768n,
      lastUpdatedTimestamp: 300,
    };

    const flashSwapParams = ArbitrageMath.tryFindArbitrageOpportunity(
      pair0,
      pair1
    );

    console.log(flashSwapParams);
    expect(flashSwapParams).toBeDefined();
    expect(flashSwapParams?.pair0).toBe(pair0.pairAddress);
    expect(flashSwapParams?.pair1).toBe(pair1.pairAddress);
    expect(flashSwapParams?.isZeroForOne).toBe(false);
    expect(flashSwapParams?.amountIn).toBeGreaterThan(0n);
    expect(flashSwapParams?.minProfit).toBe(1n);
  });
  it("Has to return the flash swap params with the correct values if there is a arbitrage opportunity and the tokens are in the opposite order", () => {
    const pair0: PairInfo = {
      pairAddress: "0x1234567890123456789012345678901234567890",
      token0: {
        address: "0x2000000000000000000000000000000000000000",
        decimals: 18,
        symbol: "WETH",
      },
      token1: {
        address: "0x1000000000000000000000000000000000000000",
        decimals: 6,
        symbol: "USDC",
      },
      reserve0: 11000000000000000n,
      reserve1: 9900n,
      lastUpdatedTimestamp: 0,
    };

    const pair1: PairInfo = {
      pairAddress: "0x2234567890123456789012345678901234567890",
      token0: {
        address: "0x1000000000000000000000000000000000000000",
        decimals: 6,
        symbol: "USDC",
      },
      token1: {
        address: "0x2000000000000000000000000000000000000000",
        decimals: 18,
        symbol: "WETH",
      },
      reserve0: 9900n,
      reserve1: 10000000000000000n,
      lastUpdatedTimestamp: 0,
    };

    const flashSwapParams = ArbitrageMath.tryFindArbitrageOpportunity(
      pair0,
      pair1
    );

    expect(flashSwapParams).toBeDefined();
    expect(flashSwapParams?.pair0).toBe(pair0.pairAddress);
    expect(flashSwapParams?.pair1).toBe(pair1.pairAddress);
    expect(flashSwapParams?.isZeroForOne).toBe(true);
    expect(flashSwapParams?.amountIn).toBeGreaterThan(0n);
    expect(flashSwapParams?.minProfit).toBe(1n);
  });
  it("Has to return the flash swap params with the correct values if there is a arbitrage opportunity and the tokens are in the opposite order and pair are swapped", () => {
    const pair0: PairInfo = {
      pairAddress: "0x2234567890123456789012345678901234567890",
      token0: {
        address: "0x1000000000000000000000000000000000000000",
        decimals: 6,
        symbol: "USDC",
      },
      token1: {
        address: "0x2000000000000000000000000000000000000000",
        decimals: 18,
        symbol: "WETH",
      },
      reserve0: 10000n,
      reserve1: 10000000000000000n,
      lastUpdatedTimestamp: 0,
    };

    const pair1: PairInfo = {
      pairAddress: "0x1234567890123456789012345678901234567890",
      token0: {
        address: "0x2000000000000000000000000000000000000000",
        decimals: 18,
        symbol: "WETH",
      },
      token1: {
        address: "0x1000000000000000000000000000000000000000",
        decimals: 6,
        symbol: "USDC",
      },
      reserve0: 10000000000000000n,
      reserve1: 9000n,
      lastUpdatedTimestamp: 0,
    };

    const flashSwapParams = ArbitrageMath.tryFindArbitrageOpportunity(
      pair0,
      pair1
    );

    expect(flashSwapParams).toBeDefined();
    expect(flashSwapParams?.pair0).toBe(pair1.pairAddress);
    expect(flashSwapParams?.pair1).toBe(pair0.pairAddress);
    expect(flashSwapParams?.isZeroForOne).toBe(true);
    expect(flashSwapParams?.amountIn).toBeGreaterThan(0n);
    expect(flashSwapParams?.minProfit).toBe(1n);
  });
});
