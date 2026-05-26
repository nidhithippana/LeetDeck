import type { Problem } from '../../types';

export const decodeWays: Problem = {
  id: 'decode-ways',
  title: 'Decode Ways',
  difficulty: 'Medium',
  topic: '1-D Dynamic Programming',
  order: 57,

  prompt: `A message containing letters from A–Z can be **encoded** into numbers using this mapping: \`A → 1, B → 2, …, Z → 26\`.

To **decode** an encoded message, all the digits must be grouped, then mapped back to letters. For example, "11106" can be decoded as "AAJF" (\`1 1 10 6\`) or "KJF" (\`11 10 6\`), but **not** as "1 11 06" (since "06" is not a valid mapping).

Given a string \`s\` of digits, return the **number of ways** to decode it. The answer fits in a 32-bit integer.`,

  examples: [
    { input: 's = "12"', output: '2', explanation: '"AB" (1 2) or "L" (12).' },
    { input: 's = "226"', output: '3', explanation: '"BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).' },
    { input: 's = "06"', output: '0' },
  ],

  constraints: ['1 <= s.length <= 100', 's contains only digits and may contain leading zeros.'],

  languages: {
    javascript: {
      functionName: 'numDecodings',
      starterCode: `function numDecodings(s) {

}`,
    },
    python: {
      functionName: 'num_decodings',
      starterCode: `def num_decodings(s):
    pass`,
    },
    typescript: {
      functionName: 'numDecodings',
      starterCode: `function numDecodings(s: string): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: ['12'], expected: 2 },
    { input: ['226'], expected: 3 },
    { input: ['06'], expected: 0 },
    { input: ['10'], expected: 1 },
    { input: ['27'], expected: 1 },
    { input: ['100'], expected: 0 },
    { input: ['11106'], expected: 2 },
  ],

  solutions: [
    {
      name: 'O(1) Rolling DP',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `\`dp[i]\` = ways to decode \`s[0..i)\`. Transitions:
- If \`s[i-1]\` is **'1'-'9'**, you can decode it as a single digit: \`dp[i] += dp[i-1]\`.
- If the two-digit number \`s[i-2..i]\` is between **10 and 26**, you can decode it as a pair: \`dp[i] += dp[i-2]\`.

Base \`dp[0] = 1\` (empty string has 1 decoding). Only the last two values are ever needed, so use two variables.`,
      code: {
        javascript: `function numDecodings(s) {
  if (!s || s[0] === '0') return 0;
  let prev2 = 1, prev1 = 1;
  for (let i = 1; i < s.length; i++) {
    let cur = 0;
    if (s[i] !== '0') cur += prev1;
    const two = parseInt(s.slice(i - 1, i + 1), 10);
    if (two >= 10 && two <= 26) cur += prev2;
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
        python: `def num_decodings(s):
    if not s or s[0] == '0':
        return 0
    prev2, prev1 = 1, 1
    for i in range(1, len(s)):
        cur = 0
        if s[i] != '0':
            cur += prev1
        two = int(s[i - 1:i + 1])
        if 10 <= two <= 26:
            cur += prev2
        prev2, prev1 = prev1, cur
    return prev1`,
        typescript: `function numDecodings(s: string): number {
  if (!s || s[0] === '0') return 0;
  let prev2 = 1, prev1 = 1;
  for (let i = 1; i < s.length; i++) {
    let cur = 0;
    if (s[i] !== '0') cur += prev1;
    const two = parseInt(s.slice(i - 1, i + 1), 10);
    if (two >= 10 && two <= 26) cur += prev2;
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/decode-ways/',
  neetcodeUrl: 'https://neetcode.io/problems/decode-ways',
};
