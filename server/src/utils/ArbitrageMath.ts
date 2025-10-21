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
    const oneMinusFee = this.div(feeNumerator, feeDenominator);
    const oneMinusFeeSquared = this.mul(oneMinusFee, oneMinusFee);
    const k =
      this.mul(oneMinusFee, reserveBIn) +
      this.mul(oneMinusFeeSquared, reserveAOut);

    const reservesIn = this.mul(reserveAIn, reserveBIn);
    const a = this.mul(k, k);
    const b = 2n * this.mul(k, reservesIn);
    const reservesInSquared = this.mul(reservesIn, reservesIn);
    const reservesInAndOut = this.mul(
      reservesIn,
      this.mul(reserveAOut, reserveBOut)
    );

    const c =
      reservesInSquared - this.mul(oneMinusFeeSquared, reservesInAndOut);

    const discriminant = this.mul(b, b) - 4n * this.mul(a, c);
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

    const optimalArbitrageAmount = this.div(numerator, denominator);
    if (optimalArbitrageAmount < 0n) {
      return 0n;
    }
    return optimalArbitrageAmount;
  }

  public static normalize(value: bigint, decimals: number): bigint {
    return value * 10n ** BigInt(18 - decimals);
  }

  public static denormalize(value: bigint, decimals: number): bigint {
    return value / 10n ** BigInt(18 - decimals);
  }

  public static mul(x: bigint, y: bigint): bigint {
    return (x * y) / this.PRECISION;
  }

  public static div(x: bigint, y: bigint): bigint {
    return (x * this.PRECISION) / y;
  }
}
