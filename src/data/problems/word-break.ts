import type { Problem } from '../../types';

export const wordBreak: Problem = {
  id: 'word-break',
  title: 'Word Break',
  difficulty: 'Medium',
  topic: '1-D Dynamic Programming',
  order: 26,

  prompt: `Given a string \`s\` and a dictionary of strings \`wordDict\`, return \`true\` if \`s\` can be segmented into a space-separated sequence of one or more dictionary words.

Note: The same word may be reused multiple times in the segmentation.`,

  examples: [
    { input: 's = "leetcode", wordDict = ["leet","code"]', output: 'true', explanation: '"leetcode" = "leet" + "code".' },
    { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: 'true', explanation: '"apple" + "pen" + "apple". Words can be reused.' },
    { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: 'false' },
  ],

  constraints: [
    '1 <= s.length <= 300',
    '1 <= wordDict.length <= 1000',
    '1 <= wordDict[i].length <= 20',
    'All wordDict[i] are unique.',
  ],

  languages: {
    javascript: {
      functionName: 'wordBreak',
      starterCode: `function wordBreak(s, wordDict) {

}`,
    },
    python: {
      functionName: 'word_break',
      starterCode: `def word_break(s, word_dict):
    pass`,
    },
    typescript: {
      functionName: 'wordBreak',
      starterCode: `function wordBreak(s: string, wordDict: string[]): boolean {
  return false;
}`,
    },
  },

  tests: [
    { input: ['leetcode', ['leet', 'code']], expected: true },
    { input: ['applepenapple', ['apple', 'pen']], expected: true },
    { input: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], expected: false },
    { input: ['a', ['a']], expected: true },
    { input: ['ab', ['a', 'b']], expected: true },
    { input: ['abcd', []], expected: false },
  ],

  solutions: [
    {
      name: 'Bottom-up DP',
      timeComplexity: 'O(n² + dict)',
      spaceComplexity: 'O(n + dict)',
      explanation: `\`dp[i] = true\` iff \`s[0..i]\` can be segmented. Base case \`dp[0] = true\` (empty prefix). For each \`i\`, scan back through earlier positions \`j\` where \`dp[j]\` is true and check whether \`s[j..i]\` is in the dictionary. Use a Set for O(1) word lookup.`,
      code: {
        javascript: `function wordBreak(s, wordDict) {
  const set = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && set.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
        python: `def word_break(s, word_dict):
    words = set(word_dict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[len(s)]`,
        typescript: `function wordBreak(s: string, wordDict: string[]): boolean {
  const set = new Set(wordDict);
  const dp = new Array<boolean>(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && set.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/word-break/',
  neetcodeUrl: 'https://neetcode.io/problems/word-break',
};
