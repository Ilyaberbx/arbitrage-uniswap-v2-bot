import { PairInfo } from "../config/AMMConfig";
import { BigMath } from "./BigMath";

export default class ArbitrageMath {
  private static calculateArbitrageOptimalAmount(
    reserveAIn: bigint,
    reserveAOut: bigint,
    reserveBIn: bigint,
    reserveBOut: bigint,
    feeNumerator: bigint = 997n,
    feeDenominator: bigint = 1000n
  ): bigint {
    const PRECISION = 10n ** 18n;

    const oneMinusFeeNumerator = feeNumerator;
    const oneMinusFeeDenominator = feeDenominator;

    const oneMinusFeeSquaredNumerator =
      oneMinusFeeNumerator * oneMinusFeeNumerator;
    const oneMinusFeeSquaredDenominator =
      oneMinusFeeDenominator * oneMinusFeeDenominator;

    const termOne =
      (oneMinusFeeNumerator * reserveBIn * PRECISION) / oneMinusFeeDenominator;
    const termTwo =
      (oneMinusFeeSquaredNumerator * reserveAOut * PRECISION) /
      oneMinusFeeSquaredDenominator;
    const k = (termOne + termTwo) / PRECISION;

    const a = k * k;

    const b = 2n * k * reserveAIn * reserveBIn;

    const reserveProduct = reserveAIn * reserveBIn;
    const cTerm1 = reserveProduct * reserveProduct;
    const cTerm2 =
      (oneMinusFeeSquaredNumerator *
        reserveAOut *
        reserveAIn *
        reserveBIn *
        reserveBOut *
        PRECISION) /
      oneMinusFeeSquaredDenominator;
    const c = cTerm1 - cTerm2 / PRECISION;

    const discriminant = b * b - 4n * a * c;

    if (discriminant < 0n) {
      return 0n;
    }

    const sqrtDiscriminant = BigMath.sqrt(discriminant);
    const numerator = -b + sqrtDiscriminant;
    const denominator = 2n * a;

    if (denominator === 0n || numerator <= 0n) {
      return 0n;
    }

    return numerator / denominator;
  }

  public static calculateOptimalArbitrageAmount(
    pair0: PairInfo,
    pair1: PairInfo,
    feeNumerator: bigint = 997n,
    feeDenominator: bigint = 1000n
  ): bigint {
    const tokensInSameOrder = pair0.token0.address === pair1.token0.address;
    const price0CumulativeLast = pair0.price0CumulativeLast;
    const price1CumulativeLast = tokensInSameOrder
      ? pair1.price0CumulativeLast
      : pair1.price1CumulativeLast;

    console.log("price0CumulativeLast", price0CumulativeLast);
    console.log("price1CumulativeLast", price1CumulativeLast);
    if (price0CumulativeLast > price1CumulativeLast) {
      const reserveAIn = pair1.reserve0;
      const reserveAOut = pair1.reserve1;
      const reserveBIn = tokensInSameOrder ? pair0.reserve0 : pair0.reserve1;
      const reserveBOut = tokensInSameOrder ? pair0.reserve1 : pair0.reserve0;

      return this.calculateArbitrageOptimalAmount(
        reserveAIn,
        reserveAOut,
        reserveBIn,
        reserveBOut,
        feeNumerator,
        feeDenominator
      );
    }

    const reserveAIn = pair0.reserve0;
    const reserveAOut = pair0.reserve1;
    const reserveBIn = tokensInSameOrder ? pair1.reserve0 : pair1.reserve1;
    const reserveBOut = tokensInSameOrder ? pair1.reserve1 : pair1.reserve0;

    return this.calculateArbitrageOptimalAmount(
      reserveAIn,
      reserveAOut,
      reserveBIn,
      reserveBOut,
      feeNumerator,
      feeDenominator
    );
  }
}
