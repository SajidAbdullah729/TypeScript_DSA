/**
 * Polynomial rolling hash on a string: prefix hashes and powers of base
 * support O(1) substring hash queries after O(n) preprocessing.
 */

function modNormalize(value: bigint, mod: bigint): bigint {
  let x = value % mod;
  if (x < 0n) x += mod;
  return x;
}

export class StringRollingHash {
  private readonly n: number;
  private readonly base: bigint;
  private readonly mod: bigint;
  private readonly prefix: bigint[];
  private readonly pow: bigint[];

  /**
   * @param s Source string (UTF-16 code units, same as `charCodeAt`).
   * @param base Must be positive and coprime to `mod` for typical use.
   * @param mod Prime modulus (e.g. 1_000_000_007n).
   */
  constructor(s: string, base = 131n, mod = 1_000_000_007n) {
    if (mod <= 0n) {
      throw new RangeError('mod must be positive');
    }
    if (base <= 0n) {
      throw new RangeError('base must be positive');
    }
    this.n = s.length;
    this.base = base;
    this.mod = mod;
    this.prefix = new Array<bigint>(this.n + 1);
    this.pow = new Array<bigint>(this.n + 1);
    this.prefix[0] = 0n;
    this.pow[0] = 1n;
    for (let i = 0; i < this.n; i++) {
      this.pow[i + 1] = modNormalize(this.pow[i]! * base, mod);
      const c = BigInt(s.charCodeAt(i));
      this.prefix[i + 1] = modNormalize(this.prefix[i]! * base + c, mod);
    }
  }

  /** Full string hash (same as substringHash(0, length)). */
  fullHash(): bigint {
    return this.prefix[this.n]!;
  }

  /**
   * Hash of `s.substring(start, start + length)` using the configured base and mod.
   * Indices are in [0, n); `length` must be non-negative and `start + length <= n`.
   */
  substringHash(start: number, length: number): bigint {
    if (length < 0) {
      throw new RangeError('length must be non-negative');
    }
    if (start < 0 || start + length > this.n) {
      throw new RangeError('substring range out of bounds');
    }
    const end = start + length;
    const high = this.prefix[end]!;
    const low = modNormalize(this.prefix[start]! * this.pow[length]!, this.mod);
    return modNormalize(high - low, this.mod);
  }

  /** Underlying string length. */
  length(): number {
    return this.n;
  }
}
