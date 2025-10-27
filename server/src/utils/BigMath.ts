export class BigMath {
  public static readonly PRECISION = 10n ** 18n;

  public static sqrt(value: bigint): bigint {
    if (value < 0n) {
      throw new Error("Cannot calculate square root of negative number");
    }
    if (value === 0n) return 0n;
    if (value < 4n) return 1n;

    let z = value;
    let x = value / 2n + 1n;
    while (x < z) {
      z = x;
      x = (value / x + x) / 2n;
    }
    return z;
  }

  public static abs(value: bigint): bigint {
    return value < 0n ? -value : value;
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

  public static convertDecimals(
    value: bigint,
    fromDecimals: number,
    toDecimals: number
  ): bigint {
    if (fromDecimals === toDecimals) {
      return value;
    }
    return value / 10n ** BigInt(fromDecimals - toDecimals);
  }
}
