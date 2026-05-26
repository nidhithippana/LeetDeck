import type { Problem } from '../../types';

export const addSearchWord: Problem = {
  id: 'add-search-word',
  title: 'Design Add and Search Word',
  difficulty: 'Medium',
  topic: 'Tries',
  order: 70,

  prompt: `Design a data structure that supports:

- \`addWord(word)\` — add \`word\` to the data structure.
- \`search(word)\` — return \`true\` if any added word matches \`word\`. \`word\` may contain the wildcard character \`.\` which matches any single letter.`,

  examples: [
    {
      input: 'WordDictionary · addWord("bad") · addWord("dad") · addWord("mad") · search("pad") · search("bad") · search(".ad") · search("b..")',
      output: 'null · null · null · null · false · true · true · true',
    },
  ],

  constraints: ['1 <= word.length <= 25', 'word consists of lowercase English letters and "."', 'At most 10^4 calls.'],

  languages: {
    javascript: {
      functionName: 'WordDictionary',
      starterCode: `class WordDictionary {
  constructor() {

  }
  addWord(word) {

  }
  search(word) {

  }
}`,
    },
    python: {
      functionName: 'WordDictionary',
      starterCode: `class WordDictionary:
    def __init__(self):
        pass

    def addWord(self, word):
        pass

    def search(self, word):
        pass`,
    },
    typescript: {
      functionName: 'WordDictionary',
      starterCode: `class WordDictionary {
  constructor() {

  }
  addWord(word: string): void {

  }
  search(word: string): boolean {
    return false;
  }
}`,
    },
  },

  isClassDesign: true,
  tests: [],
  classTests: [
    {
      ops: ['WordDictionary', 'addWord', 'addWord', 'addWord', 'search', 'search', 'search', 'search'],
      args: [[], ['bad'], ['dad'], ['mad'], ['pad'], ['bad'], ['.ad'], ['b..']],
      expected: [null, null, null, null, false, true, true, true],
    },
    {
      ops: ['WordDictionary', 'addWord', 'search', 'search'],
      args: [[], ['a'], ['a'], ['.']],
      expected: [null, null, true, true],
    },
  ],

  solutions: [
    {
      name: 'Trie + DFS for wildcards',
      timeComplexity: 'O(L) add, O(26^L) worst-case search if all wildcards',
      spaceComplexity: 'O(total chars)',
      explanation: `Storage is a standard trie. For search, walk the word character by character. When we hit \`.\`, we have to **try every child** as a recursive branch — DFS. Otherwise it's a simple walk.`,
      code: {
        javascript: `class WordDictionary {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
  addWord(word) {
    let node = this;
    for (const c of word) {
      if (!node.children[c]) node.children[c] = new WordDictionary();
      node = node.children[c];
    }
    node.isEnd = true;
  }
  search(word) {
    const dfs = (node, i) => {
      if (i === word.length) return node.isEnd;
      const c = word[i];
      if (c === '.') {
        for (const child of Object.values(node.children)) {
          if (dfs(child, i + 1)) return true;
        }
        return false;
      }
      return node.children[c] ? dfs(node.children[c], i + 1) : false;
    };
    return dfs(this, 0);
  }
}`,
        python: `class WordDictionary:
    def __init__(self):
        self.children = {}
        self.is_end = False

    def addWord(self, word):
        node = self
        for c in word:
            if c not in node.children:
                node.children[c] = WordDictionary()
            node = node.children[c]
        node.is_end = True

    def search(self, word):
        def dfs(node, i):
            if i == len(word):
                return node.is_end
            c = word[i]
            if c == '.':
                for child in node.children.values():
                    if dfs(child, i + 1):
                        return True
                return False
            return dfs(node.children[c], i + 1) if c in node.children else False
        return dfs(self, 0)`,
        typescript: `class WordDictionary {
  children: Record<string, WordDictionary> = {};
  isEnd = false;
  addWord(word: string): void {
    let node: WordDictionary = this;
    for (const c of word) {
      if (!node.children[c]) node.children[c] = new WordDictionary();
      node = node.children[c];
    }
    node.isEnd = true;
  }
  search(word: string): boolean {
    const dfs = (node: WordDictionary, i: number): boolean => {
      if (i === word.length) return node.isEnd;
      const c = word[i];
      if (c === '.') {
        for (const child of Object.values(node.children)) {
          if (dfs(child, i + 1)) return true;
        }
        return false;
      }
      return node.children[c] ? dfs(node.children[c], i + 1) : false;
    };
    return dfs(this, 0);
  }
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/',
  neetcodeUrl: 'https://neetcode.io/problems/design-word-search-data-structure',
};
