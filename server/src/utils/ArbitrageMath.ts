import { PairInfo } from "../types/AMMV2Config";
import { FlashSwapParams } from "../types/ArbitrageV2Config";
import { BigMath } from "./BigMath";

export default class ArbitrageMath {
  public static calculateArbitrageOptimalAmount(
    reserveAIn: bigint,
    reserveAOut: bigint,
    reserveBIn: bigint,
    reserveBOut: bigint,
    feeNumerator: bigint = 997n,
    feeDenominator: bigint = 1000n
  ): bigint {
    const oneMinusFee = BigMath.div(feeNumerator, feeDenominator);
    const oneMinusFeeSquared = BigMath.mul(oneMinusFee, oneMinusFee);
    const k =
      BigMath.mul(oneMinusFee, reserveBIn) +
      BigMath.mul(oneMinusFeeSquared, reserveAOut);

    const reservesIn = BigMath.mul(reserveAIn, reserveBIn);
    const a = BigMath.mul(k, k);
    const b = 2n * BigMath.mul(k, reservesIn);
    const reservesInSquared = BigMath.mul(reservesIn, reservesIn);
    const reservesInAndOut = BigMath.mul(
      reservesIn,
      BigMath.mul(reserveAOut, reserveBOut)
    );

    const c =
      reservesInSquared - BigMath.mul(oneMinusFeeSquared, reservesInAndOut);

    const discriminant = BigMath.mul(b, b) - 4n * BigMath.mul(a, c);
    if (discriminant < 0n) {
      return 0n;
    }
    const denominator = 2n * a;
    if (denominator === 0n) {
      return 0n;
    }
    const sqrtDiscriminant = BigMath.sqrt(discriminant);

    const sqrtDiscriminantScaled = sqrtDiscriminant * 10n ** 9n;

    const numerator = -b + sqrtDiscriminantScaled;

    const optimalArbitrageAmount = BigMath.div(numerator, denominator);
    if (optimalArbitrageAmount < 0n) {
      return 0n;
    }
    return optimalArbitrageAmount;
  }

  public static tryFindArbitrageOpportunity(
    pair0: PairInfo,
    pair1: PairInfo
  ): FlashSwapParams | undefined {
    if (!this.isValidPairs(pair0, pair1)) {
      return undefined;
    }

    const tokensInSameOrder =
      pair0.token0.address === pair1.token0.address &&
      pair0.token1.address === pair1.token1.address;

    const {
      normalizedPair0Reserve0,
      normalizedPair0Reserve1,
      normalizedPair1Reserve0,
      normalizedPair1Reserve1,
    } = this.normalizeReserves(pair0, pair1, tokensInSameOrder);

    const { pair0ReservesRatio, pair1ReservesRatio } =
      this.calculateReserveRatios(
        normalizedPair0Reserve0,
        normalizedPair0Reserve1,
        normalizedPair1Reserve0,
        normalizedPair1Reserve1
      );

    const {
      reserveAIn,
      reserveAOut,
      reserveBIn,
      reserveBOut,
      isZeroForOne,
      pairsSwapped,
    } = this.defineReservesToSwap(
      pair0ReservesRatio,
      pair1ReservesRatio,
      normalizedPair0Reserve0,
      normalizedPair0Reserve1,
      normalizedPair1Reserve0,
      normalizedPair1Reserve1,
      tokensInSameOrder
    );

    const optimalArbitrageAmount = this.calculateArbitrageOptimalAmount(
      reserveAIn,
      reserveAOut,
      reserveBIn,
      reserveBOut
    );

    if (optimalArbitrageAmount <= 0n) {
      return undefined;
    }

    const pair0ForFlashSwap = pairsSwapped ? pair1 : pair0;
    const pair1ForFlashSwap = pairsSwapped ? pair0 : pair1;
    const referencePair = pairsSwapped ? pair1 : pair0;
    const referenceDecimals = isZeroForOne
      ? referencePair.token0.decimals
      : referencePair.token1.decimals;
    return {
      pair0: pair0ForFlashSwap.pairAddress,
      pair1: pair1ForFlashSwap.pairAddress,
      isZeroForOne: isZeroForOne,
      amountIn: BigMath.denormalize(optimalArbitrageAmount, referenceDecimals),
      minProfit: 1n,
    };
  }

  private static calculateReserveRatios(
    normalizedPair0Reserve0: bigint,
    normalizedPair0Reserve1: bigint,
    normalizedPair1Reserve0: bigint,
    normalizedPair1Reserve1: bigint
  ): {
    pair0ReservesRatio: number;
    pair1ReservesRatio: number;
  } {
    return {
      pair0ReservesRatio:
        Number(normalizedPair0Reserve0) / Number(normalizedPair0Reserve1),
      pair1ReservesRatio:
        Number(normalizedPair1Reserve0) / Number(normalizedPair1Reserve1),
    };
  }

  private static normalizeReserves(
    pair0: PairInfo,
    pair1: PairInfo,
    tokensInSameOrder: boolean
  ): {
    normalizedPair0Reserve0: bigint;
    normalizedPair0Reserve1: bigint;
    normalizedPair1Reserve0: bigint;
    normalizedPair1Reserve1: bigint;
  } {
    return {
      normalizedPair0Reserve0: BigMath.normalize(
        pair0.reserve0,
        pair0.token0.decimals
      ),
      normalizedPair0Reserve1: BigMath.normalize(
        pair0.reserve1,
        pair0.token1.decimals
      ),
      normalizedPair1Reserve0: tokensInSameOrder
        ? BigMath.normalize(pair1.reserve0, pair1.token0.decimals)
        : BigMath.normalize(pair1.reserve1, pair1.token1.decimals),
      normalizedPair1Reserve1: tokensInSameOrder
        ? BigMath.normalize(pair1.reserve1, pair1.token1.decimals)
        : BigMath.normalize(pair1.reserve0, pair1.token0.decimals),
    };
  }

  private static isValidPairs(pair0: PairInfo, pair1: PairInfo): boolean {
    return (
      (pair0.token0.address === pair1.token0.address &&
        pair0.token1.address === pair1.token1.address) ||
      (pair0.token0.address === pair1.token1.address &&
        pair0.token1.address === pair1.token0.address)
    );
  }

  private static defineReservesToSwap(
    pair0ReservesRatio: number,
    pair1ReservesRatio: number,
    normalizedPair0Reserve0: bigint,
    normalizedPair0Reserve1: bigint,
    normalizedPair1Reserve0: bigint,
    normalizedPair1Reserve1: bigint,
    tokensInSameOrder: boolean
  ): {
    reserveAIn: bigint;
    reserveAOut: bigint;
    reserveBIn: bigint;
    reserveBOut: bigint;
    isZeroForOne: boolean;
    pairsSwapped: boolean;
  } {
    const pair0HasGreaterReservesDifference =
      Math.abs(1 - pair0ReservesRatio) > Math.abs(1 - pair1ReservesRatio);

    if (pair0HasGreaterReservesDifference) {
      const oneForZero = normalizedPair0Reserve0 < normalizedPair0Reserve1;

      return {
        reserveAIn: oneForZero
          ? normalizedPair0Reserve0
          : normalizedPair0Reserve1,
        reserveAOut: oneForZero
          ? normalizedPair0Reserve1
          : normalizedPair0Reserve0,
        reserveBIn: oneForZero
          ? normalizedPair1Reserve0
          : normalizedPair1Reserve1,
        reserveBOut: oneForZero
          ? normalizedPair1Reserve1
          : normalizedPair1Reserve0,
        isZeroForOne: oneForZero,
        pairsSwapped: false,
      };
    }

    const oneForZero = normalizedPair1Reserve0 < normalizedPair1Reserve1;

    return {
      reserveAIn: oneForZero
        ? normalizedPair1Reserve0
        : normalizedPair1Reserve1,
      reserveAOut: oneForZero
        ? normalizedPair1Reserve1
        : normalizedPair1Reserve0,
      reserveBIn: oneForZero
        ? normalizedPair0Reserve0
        : normalizedPair0Reserve1,
      reserveBOut: oneForZero
        ? normalizedPair0Reserve1
        : normalizedPair0Reserve0,
      isZeroForOne: tokensInSameOrder ? oneForZero : !oneForZero,
      pairsSwapped: true,
    };
  }
}
