import type { Problem } from '../../types';

export const implementTrie: Problem = {
  id: 'implement-trie',
  title: 'Implement Trie (Prefix Tree)',
  difficulty: 'Medium',
  topic: 'Tries',
  order: 69,

  prompt: `Implement the **Trie** class:

- \`Trie()\` — initialize the trie.
- \`insert(word)\` — insert \`word\` into the trie.
- \`search(word)\` — return \`true\` if \`word\` is in the trie (was previously inserted).
- \`startsWith(prefix)\` — return \`true\` if there is any previously inserted word that **starts with** \`prefix\`.

A trie is a tree where each path from the root spells out a word, with branching at each character. All inserted words share their common prefixes.`,

  examples: [
    {
      input: 'Trie · insert("apple") · search("apple") · search("app") · startsWith("app") · insert("app") · search("app")',
      output: 'null · null · true · false · true · null · true',
    },
  ],

  constraints: ['1 <= word.length, prefix.length <= 2000', 'All inputs consist of lowercase English letters.', 'At most 3 * 10^4 calls total.'],

  languages: {
    javascript: {
      functionName: 'Trie',
      starterCode: `class Trie {
  constructor() {

  }

  insert(word) {

  }

  search(word) {

  }

  startsWith(prefix) {

  }
}`,
    },
    python: {
      functionName: 'Trie',
      starterCode: `class Trie:
    def __init__(self):
        pass

    def insert(self, word):
        pass

    def search(self, word):
        pass

    def startsWith(self, prefix):
        pass`,
    },
    typescript: {
      functionName: 'Trie',
      starterCode: `class Trie {
  constructor() {

  }

  insert(word: string): void {

  }

  search(word: string): boolean {
    return false;
  }

  startsWith(prefix: string): boolean {
    return false;
  }
}`,
    },
  },

  isClassDesign: true,
  tests: [],
  classTests: [
    {
      ops: ['Trie', 'insert', 'search', 'search', 'startsWith', 'insert', 'search'],
      args: [[], ['apple'], ['apple'], ['app'], ['app'], ['app'], ['app']],
      expected: [null, null, true, false, true, null, true],
    },
    {
      ops: ['Trie', 'insert', 'search', 'startsWith'],
      args: [[], ['hello'], ['hell'], ['hell']],
      expected: [null, null, false, true],
    },
    {
      ops: ['Trie', 'startsWith'],
      args: [[], ['a']],
      expected: [null, false],
    },
  ],

  solutions: [
    {
      name: 'Node Tree with Children Map',
      timeComplexity: 'O(L) per op where L = word length',
      spaceComplexity: 'O(sum of all word lengths)',
      explanation: `Each node has a map of \`char → child node\` and a flag indicating whether a word ends here. \`insert\` walks down, creating nodes as needed; \`search\` walks and checks the end flag; \`startsWith\` walks and just checks reachability.`,
      code: {
        javascript: `class Trie {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
  insert(word) {
    let node = this;
    for (const c of word) {
      if (!node.children[c]) node.children[c] = new Trie();
      node = node.children[c];
    }
    node.isEnd = true;
  }
  search(word) {
    const node = this._traverse(word);
    return !!node && node.isEnd;
  }
  startsWith(prefix) {
    return !!this._traverse(prefix);
  }
  _traverse(s) {
    let node = this;
    for (const c of s) {
      if (!node.children[c]) return null;
      node = node.children[c];
    }
    return node;
  }
}`,
        python: `class Trie:
    def __init__(self):
        self.children = {}
        self.is_end = False

    def insert(self, word):
        node = self
        for c in word:
            if c not in node.children:
                node.children[c] = Trie()
            node = node.children[c]
        node.is_end = True

    def search(self, word):
        node = self._traverse(word)
        return node is not None and node.is_end

    def startsWith(self, prefix):
        return self._traverse(prefix) is not None

    def _traverse(self, s):
        node = self
        for c in s:
            if c not in node.children:
                return None
            node = node.children[c]
        return node`,
        typescript: `class Trie {
  children: Record<string, Trie> = {};
  isEnd = false;
  insert(word: string): void {
    let node: Trie = this;
    for (const c of word) {
      if (!node.children[c]) node.children[c] = new Trie();
      node = node.children[c];
    }
    node.isEnd = true;
  }
  search(word: string): boolean {
    const node = this._traverse(word);
    return !!node && node.isEnd;
  }
  startsWith(prefix: string): boolean {
    return !!this._traverse(prefix);
  }
  _traverse(s: string): Trie | null {
    let node: Trie = this;
    for (const c of s) {
      if (!node.children[c]) return null;
      node = node.children[c];
    }
    return node;
  }
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
  neetcodeUrl: 'https://neetcode.io/problems/implement-prefix-tree',
};
