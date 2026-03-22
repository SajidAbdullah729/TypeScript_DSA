/**
 * Rabin–Karp string matching with **triple hashing**: three independent polynomial hashes
 * (same base, distinct prime moduli). A window is a candidate only when all three hashes
 * match the pattern’s triple—collision probability is negligible; we still verify with a
 * direct character comparison so results are always correct.
 */

function modNormalize(value: bigint, mod: bigint): bigint {
  let x = value % mod;
  if (x < 0n) x += mod;
  return x;
}

/** Default moduli: distinct large primes (common CP / hashing choices). */
export const RABIN_KARP_DEFAULT_MODS = [
  1_000_000_007n,
  1_000_000_009n,
  998_244_353n,
] as const;

export type RabinKarpTripleMods = readonly [bigint, bigint, bigint];

export class RabinKarp {
  private readonly pattern: string;
  private readonly base: bigint;
  private readonly mods: RabinKarpTripleMods;

  /**
   * @param pattern Pattern to search for (UTF-16 code units, same as `charCodeAt`).
   * @param base Shared radix (default 131), same idea as `StringRollingHash`.
   * @param mods Three distinct prime moduli for independent rolling hashes.
   */
  constructor(
    pattern: string,
    base = 131n,
    mods: RabinKarpTripleMods = RABIN_KARP_DEFAULT_MODS
  ) {
    if (base <= 0n) {
      throw new RangeError('base must be positive');
    }
    for (let j = 0; j < 3; j++) {
      if (mods[j]! <= 0n) {
        throw new RangeError('each mod must be positive');
      }
    }
    this.pattern = pattern;
    this.base = base;
    this.mods = mods;
  }

  private static substringsEqual(
    text: string,
    start: number,
    pattern: string,
    length: number
  ): boolean {
    for (let k = 0; k < length; k++) {
      if (text[start + k] !== pattern[k]) return false;
    }
    return true;
  }

  /** Iterative hash of `s[0..length)` for each modulus. */
  private hashPrefix(s: string, length: number): RabinKarpTripleMods {
    const h: [bigint, bigint, bigint] = [0n, 0n, 0n];
    const { base, mods } = this;
    for (let i = 0; i < length; i++) {
      const c = BigInt(s.charCodeAt(i));
      for (let j = 0; j < 3; j++) {
        h[j] = modNormalize(h[j]! * base + c, mods[j]!);
      }
    }
    return h;
  }

  /** `base^(m-1) mod mods[j]` for sliding the left character out of the window. */
  private powHighForWindow(m: number): RabinKarpTripleMods {
    const out: [bigint, bigint, bigint] = [1n, 1n, 1n];
    const { base, mods } = this;
    for (let j = 0; j < 3; j++) {
      let p = 1n;
      const mod = mods[j]!;
      for (let i = 0; i < m - 1; i++) {
        p = modNormalize(p * base, mod);
      }
      out[j] = p;
    }
    return out;
  }

  private slideWindow(
    window: RabinKarpTripleMods,
    left: bigint,
    right: bigint,
    powHigh: RabinKarpTripleMods
  ): RabinKarpTripleMods {
    const next: [bigint, bigint, bigint] = [0n, 0n, 0n];
    const { base, mods } = this;
    for (let j = 0; j < 3; j++) {
      const mod = mods[j]!;
      const w = window[j]!;
      const ph = powHigh[j]!;
      next[j] = modNormalize(
        modNormalize(w - modNormalize(left * ph, mod), mod) * base + right,
        mod
      );
    }
    return next;
  }

  private triplesEqual(a: RabinKarpTripleMods, b: RabinKarpTripleMods): boolean {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  }

  /**
   * All start indices in `text` where `this.pattern` occurs.
   * Empty pattern yields no matches.
   */
  search(text: string): number[] {
    const pat = this.pattern;
    const m = pat.length;
    const n = text.length;
    if (m === 0) return [];
    if (m > n) return [];

    const patHash = this.hashPrefix(pat, m);
    let windowHash = this.hashPrefix(text, m);
    const powHigh = this.powHighForWindow(m);
    const matches: number[] = [];

    for (let i = 0; i <= n - m; i++) {
      if (
        this.triplesEqual(windowHash, patHash) &&
        RabinKarp.substringsEqual(text, i, pat, m)
      ) {
        matches.push(i);
      }
      if (i + m >= n) break;
      const left = BigInt(text.charCodeAt(i));
      const right = BigInt(text.charCodeAt(i + m));
      windowHash = this.slideWindow(windowHash, left, right, powHigh);
    }

    return matches;
  }

  /** One-shot: all occurrences of `pattern` in `text`. */
  static findOccurrences(
    text: string,
    pattern: string,
    base = 131n,
    mods: RabinKarpTripleMods = RABIN_KARP_DEFAULT_MODS
  ): number[] {
    return new RabinKarp(pattern, base, mods).search(text);
  }
}
