/**
 * Trie (prefix tree) for UTF-16 strings.
 * Supports insert/search/prefix checks and word removal.
 */

class TrieNode {
  readonly children = new Map<string, TrieNode>();
  isWord = false;
}

export class Trie {
  private readonly root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  /** Insert a word into the trie. */
  insert(word: string): void {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const ch = word[i]!;
      let next = node.children.get(ch);
      if (!next) {
        next = new TrieNode();
        node.children.set(ch, next);
      }
      node = next;
    }
    node.isWord = true;
  }

  /** Returns true if the exact word exists in the trie. */
  search(word: string): boolean {
    const node = this.findNode(word);
    return node !== undefined && node.isWord;
  }

  /** Returns true if there is any inserted word with this prefix. */
  startsWith(prefix: string): boolean {
    return this.findNode(prefix) !== undefined;
  }

  /**
   * Remove one exact word from the trie.
   * Returns true when the word existed and was removed.
   */
  delete(word: string): boolean {
    const path: Array<{ parent: TrieNode; ch: string; node: TrieNode }> = [];
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const ch = word[i]!;
      const next = node.children.get(ch);
      if (!next) return false;
      path.push({ parent: node, ch, node: next });
      node = next;
    }
    if (!node.isWord) return false;

    node.isWord = false;

    // Prune nodes that are no longer needed.
    for (let i = path.length - 1; i >= 0; i--) {
      const segment = path[i]!;
      if (segment.node.isWord || segment.node.children.size > 0) break;
      segment.parent.children.delete(segment.ch);
    }

    return true;
  }

  /** Returns true when no words have been inserted. */
  isEmpty(): boolean {
    return this.root.children.size === 0;
  }

  private findNode(path: string): TrieNode | undefined {
    let node = this.root;
    for (let i = 0; i < path.length; i++) {
      const next = node.children.get(path[i]!);
      if (!next) return undefined;
      node = next;
    }
    return node;
  }
}
