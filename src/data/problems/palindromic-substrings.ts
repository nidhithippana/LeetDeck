import type { Problem } from '../../types';

export const palindromicSubstrings: Problem = {
  id: 'palindromic-substrings',
  title: 'Palindromic Substrings',
  difficulty: 'Medium',
  topic: '1-D Dynamic Programming',
  order: 58,

  prompt: `Given a string \`s\`, return the **number of palindromic substrings** in it.

A string is a palindrome when it reads the same backward as forward. Different substrings that share the same content but occur at different positions count separately.`,

  examples: [
    { input: 's = "abc"', output: '3', explanation: 'Three single-character palindromes: a, b, c.' },
    { input: 's = "aaa"', output: '6', explanation: 'Palindromes: a, a, a, aa, aa, aaa.' },
  ],

  constraints: ['1 <= s.length <= 1000', 's consists of lowercase English letters.'],

  languages: {
    javascript: {
      functionName: 'countSubstrings',
      starterCode: `function countSubstrings(s) {

}`,
    },
    python: {
      functionName: 'count_substrings',
      starterCode: `def count_substrings(s):
    pass`,
    },
    typescript: {
      functionName: 'countSubstrings',
      starterCode: `function countSubstrings(s: string): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: ['abc'], expected: 3 },
    { input: ['aaa'], expected: 6 },
    { input: ['a'], expected: 1 },
    { input: ['aba'], expected: 4 },
    { input: ['racecar'], expected: 10 },
    { input: ['abba'], expected: 6 },
  ],

  solutions: [
    {
      name: 'Expand Around Center',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      explanation: `Each palindrome has a center — either at a character (odd length) or between two characters (even length). For each of the \`2n - 1\` centers, expand outward while characters match, counting each valid expansion as one palindromic substring.`,
      code: {
        javascript: `function countSubstrings(s) {
  let count = 0;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      count++;
      l--; r++;
    }
  };
  for (let i = 0; i < s.length; i++) {
    expand(i, i);     // odd-length
    expand(i, i + 1); // even-length
  }
  return count;
}`,
        python: `def count_substrings(s):
    count = 0
    def expand(l, r):
        nonlocal count
        while l >= 0 and r < len(s) and s[l] == s[r]:
            count += 1
            l -= 1
            r += 1
    for i in range(len(s)):
        expand(i, i)
        expand(i, i + 1)
    return count`,
        typescript: `function countSubstrings(s: string): number {
  let count = 0;
  const expand = (l: number, r: number): void => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      count++;
      l--; r++;
    }
  };
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return count;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/palindromic-substrings/',
  neetcodeUrl: 'https://neetcode.io/problems/palindromic-substrings',
};
