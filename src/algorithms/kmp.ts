/**
 * Knuth–Morris–Pratt (KMP) string matching.
 * Precomputes the LPS (longest proper prefix which is also suffix) table for the pattern,
 * then scans text in O(n + m) time.
 */
export class KnuthMorrisPratt {
  private readonly pattern: string;
  private readonly lps: number[];

  constructor(pattern: string) {
    this.pattern = pattern;
    this.lps = KnuthMorrisPratt.buildLps(pattern);
  }

  /** LPS array: lps[i] = length of longest proper prefix of pattern[0..i] that is also a suffix. */
  static buildLps(pattern: string): number[] {
    const m = pattern.length;
    const lps = new Array<number>(m).fill(0);
    let len = 0;
    let i = 1;
    while (i < m) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else if (len !== 0) {
        len = lps[len - 1]!;
      } else {
        lps[i] = 0;
        i++;
      }
    }
    return lps;
  }

  /**
   * All start indices in `text` where `this.pattern` occurs.
   * Empty pattern yields no matches.
   */
  search(text: string): number[] {
    const m = this.pattern.length;
    if (m === 0) return [];

    const n = text.length;
    const matches: number[] = [];
    let i = 0;
    let j = 0;

    while (i < n) {
      if (text[i] === this.pattern[j]) {
        i++;
        j++;
      }

      if (j === m) {
        matches.push(i - j);
        j = this.lps[j - 1]!;
      } else if (i < n && text[i] !== this.pattern[j]) {
        if (j !== 0) {
          j = this.lps[j - 1]!;
        } else {
          i++;
        }
      }
    }

    return matches;
  }

  /** One-shot: all occurrences of `pattern` in `text`. */
  static findOccurrences(text: string, pattern: string): number[] {
    return new KnuthMorrisPratt(pattern).search(text);
  }
}
