import type { Problem } from '../../types';

export const longestCommonSubsequence: Problem = {
  id: 'longest-common-subsequence',
  title: 'Longest Common Subsequence',
  difficulty: 'Medium',
  topic: '2-D Dynamic Programming',
  order: 59,

  prompt: `Given two strings \`text1\` and \`text2\`, return the length of their **longest common subsequence**. If there is no common subsequence, return \`0\`.

A **subsequence** of a string is a new string generated from the original by deleting some characters (possibly none) without changing the order of the remaining characters.`,

  examples: [
    { input: 'text1 = "abcde", text2 = "ace"', output: '3', explanation: '"ace" is the LCS.' },
    { input: 'text1 = "abc", text2 = "abc"', output: '3' },
    { input: 'text1 = "abc", text2 = "def"', output: '0' },
  ],

  constraints: ['1 <= text1.length, text2.length <= 1000', 'text1 and text2 consist of lowercase English letters.'],

  languages: {
    javascript: {
      functionName: 'longestCommonSubsequence',
      starterCode: `function longestCommonSubsequence(text1, text2) {

}`,
    },
    python: {
      functionName: 'longest_common_subsequence',
      starterCode: `def longest_common_subsequence(text1, text2):
    pass`,
    },
    typescript: {
      functionName: 'longestCommonSubsequence',
      starterCode: `function longestCommonSubsequence(text1: string, text2: string): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: ['abcde', 'ace'], expected: 3 },
    { input: ['abc', 'abc'], expected: 3 },
    { input: ['abc', 'def'], expected: 0 },
    { input: ['ezupkr', 'ubmrapg'], expected: 2 },
    { input: ['a', 'a'], expected: 1 },
  ],

  solutions: [
    {
      name: '2D DP',
      timeComplexity: 'O(m·n)',
      spaceComplexity: 'O(m·n)',
      explanation: `\`dp[i][j]\` = LCS length of \`text1[0..i)\` and \`text2[0..j)\`.

- If \`text1[i-1] === text2[j-1]\` → \`dp[i][j] = dp[i-1][j-1] + 1\`
- Otherwise → \`dp[i][j] = max(dp[i-1][j], dp[i][j-1])\`

The answer is \`dp[m][n]\`. Can be reduced to O(min(m,n)) space using two rolling rows.`,
      code: {
        javascript: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}`,
        python: `def longest_common_subsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`,
        typescript: `function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length, n = text2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/',
  neetcodeUrl: 'https://neetcode.io/problems/longest-common-subsequence',
};
