import { PairInfo } from "../types/AMMV2Config";
import { BigMath } from "./BigMath";

export default class ArbitrageMath {
  private static readonly PRECISION = 10n ** 18n;

  public static calculateArbitrageOptimalAmount(
    reserveAIn: bigint,
    reserveAOut: bigint,
    reserveBIn: bigint,
    reserveBOut: bigint,
    feeNumerator: bigint = 997n,
    feeDenominator: bigint = 1000n
  ): bigint {
    const oneMinusFee = (feeNumerator * this.PRECISION) / feeDenominator;
    const oneMinusFeeSquared = (oneMinusFee * oneMinusFee) / this.PRECISION;

    const k =
      (oneMinusFee * reserveBIn) / this.PRECISION +
      (oneMinusFeeSquared * reserveAOut) / this.PRECISION;
    const a = BigMath.pow(k, 2n);
    const b = 2n * k * reserveAIn * reserveBIn;
    const reservesIn = reserveAIn * reserveBIn;
    const reservesInSquared = BigMath.pow(reservesIn, 2n);
    const reservesInAndOut = reservesIn * reserveAOut * reserveBOut;
    const c =
      reservesInSquared -
      (oneMinusFeeSquared * reservesInAndOut) / this.PRECISION;

    const discriminant = BigMath.pow(b, 2n) - 4n * a * c;

    if (discriminant < 0n) {
      return 0n;
    }

    const denominator = 2n * a;
    if (denominator === 0n) {
      return 0n;
    }

    const numerator = -b + BigMath.sqrt(discriminant);
    const optimalArbitrageAmount = numerator / denominator;

    if (optimalArbitrageAmount < 0n) {
      return 0n;
    }

    return optimalArbitrageAmount;
  }

  public static assessArbitrageOpportunity(
    pair0: PairInfo,
    pair1: PairInfo,
    feeNumerator: bigint = 997n,
    feeDenominator: bigint = 1000n
  ): {
    optimalArbitrageAmount: bigint;
    isZeroForOne: boolean;
    pair0: PairInfo;
    pair1: PairInfo;
  } {
    const tokensInSameOrder = pair0.token0.address === pair1.token0.address;
    const pair0ReservesRatio = pair0.reserve0 / pair0.reserve1;
    const pair1ReservesRatio = tokensInSameOrder
      ? pair1.reserve0 / pair1.reserve1
      : pair1.reserve1 / pair1.reserve0;

    const idealLiquidityDifferencePair0 = BigMath.abs(1n - pair0ReservesRatio);
    const idealLiquidityDifferencePair1 = BigMath.abs(1n - pair1ReservesRatio);

    if (idealLiquidityDifferencePair0 > idealLiquidityDifferencePair1) {
      const isZeroForOne = pair0.reserve0 < pair0.reserve1;
      const normalizedPair1Reserve0 = tokensInSameOrder
        ? pair1.reserve0
        : pair1.reserve1;
      const normalizedPair1Reserve1 = tokensInSameOrder
        ? pair1.reserve1
        : pair1.reserve0;

      let reserveAIn = isZeroForOne ? pair0.reserve0 : pair0.reserve1;
      let reserveAOut = isZeroForOne ? pair0.reserve1 : pair0.reserve0;
      let reserveBIn = isZeroForOne
        ? normalizedPair1Reserve0
        : normalizedPair1Reserve1;
      let reserveBOut = isZeroForOne
        ? normalizedPair1Reserve1
        : normalizedPair1Reserve0;

      let optimalArbitrageAmount = this.calculateArbitrageOptimalAmount(
        reserveAIn,
        reserveAOut,
        reserveBIn,
        reserveBOut,
        feeNumerator,
        feeDenominator
      );

      return {
        optimalArbitrageAmount,
        isZeroForOne: isZeroForOne,
        pair0,
        pair1,
      };
    }

    const isZeroForOne = pair1.reserve0 < pair1.reserve1;
    const normalizedPair0Reserve0 = tokensInSameOrder
      ? pair0.reserve0
      : pair0.reserve1;
    const normalizedPair0Reserve1 = tokensInSameOrder
      ? pair0.reserve1
      : pair0.reserve0;

    let reserveAIn = isZeroForOne ? pair1.reserve0 : pair1.reserve1;
    let reserveAOut = isZeroForOne ? pair1.reserve1 : pair1.reserve0;
    let reserveBIn = isZeroForOne
      ? normalizedPair0Reserve0
      : normalizedPair0Reserve1;
    let reserveBOut = isZeroForOne
      ? normalizedPair0Reserve1
      : normalizedPair0Reserve0;

    let optimalArbitrageAmount = this.calculateArbitrageOptimalAmount(
      reserveAIn,
      reserveAOut,
      reserveBIn,
      reserveBOut,
      feeNumerator,
      feeDenominator
    );

    return {
      optimalArbitrageAmount,
      isZeroForOne: isZeroForOne,
      pair0: pair1,
      pair1: pair0,
    };
  }
}
