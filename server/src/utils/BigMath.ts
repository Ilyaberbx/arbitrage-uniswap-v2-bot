export class BigMath {
  public static abs(x: bigint) {
    return x < 0n ? -x : x;
  }
  public static sign(x: bigint) {
    if (x === 0n) return 0n;
    return x < 0n ? -1n : 1n;
  }
  public static pow(base: bigint, exponent: bigint) {
    return base ** exponent;
  }
  public static min(value: bigint, ...values: bigint[]) {
    for (const v of values) if (v < value) value = v;
    return value;
  }
  public static max(value: bigint, ...values: bigint[]) {
    for (const v of values) if (v > value) value = v;
    return value;
  }

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
}
