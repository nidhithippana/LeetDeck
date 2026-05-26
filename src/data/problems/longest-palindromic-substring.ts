import type { Problem } from '../../types';

export const longestPalindromicSubstring: Problem = {
  id: 'longest-palindromic-substring',
  title: 'Longest Palindromic Substring',
  difficulty: 'Medium',
  topic: '1-D Dynamic Programming',
  order: 34,

  prompt: `Given a string \`s\`, return the **longest palindromic substring** in \`s\`.

If multiple substrings tie for longest, return any of them (tests use the first one your algorithm finds at the maximum length).`,

  examples: [
    { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' },
    { input: 's = "cbbd"', output: '"bb"' },
  ],

  constraints: ['1 <= s.length <= 1000', 's consists of digits and English letters.'],

  languages: {
    javascript: {
      functionName: 'longestPalindrome',
      starterCode: `function longestPalindrome(s) {

}`,
    },
    python: {
      functionName: 'longest_palindrome',
      starterCode: `def longest_palindrome(s):
    pass`,
    },
    typescript: {
      functionName: 'longestPalindrome',
      starterCode: `function longestPalindrome(s: string): string {
  return '';
}`,
    },
  },

  tests: [
    // Tests use "first found at max length" with the expand-around-center algorithm walking left-to-right.
    { input: ['babad'], expected: 'bab' },
    { input: ['cbbd'], expected: 'bb' },
    { input: ['a'], expected: 'a' },
    { input: ['ac'], expected: 'a' },
    { input: ['racecar'], expected: 'racecar' },
    { input: ['aaaa'], expected: 'aaaa' },
  ],

  solutions: [
    {
      name: 'Expand Around Center',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      explanation: `Every palindrome has a center — either a single character (odd length) or between two equal characters (even length). For each of the \`2n - 1\` possible centers, expand outward as long as both sides match. Track the longest found.`,
      code: {
        javascript: `function longestPalindrome(s) {
  if (!s) return '';
  let start = 0, maxLen = 1;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l--; r++;
    }
    return [l + 1, r - 1 - l]; // [start, length]
  };
  for (let i = 0; i < s.length; i++) {
    const [s1, len1] = expand(i, i);
    if (len1 > maxLen) { start = s1; maxLen = len1; }
    const [s2, len2] = expand(i, i + 1);
    if (len2 > maxLen) { start = s2; maxLen = len2; }
  }
  return s.substring(start, start + maxLen);
}`,
        python: `def longest_palindrome(s):
    if not s:
        return ''
    start, max_len = 0, 1

    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return l + 1, r - 1 - l

    for i in range(len(s)):
        s1, l1 = expand(i, i)
        if l1 > max_len:
            start, max_len = s1, l1
        s2, l2 = expand(i, i + 1)
        if l2 > max_len:
            start, max_len = s2, l2

    return s[start:start + max_len]`,
        typescript: `function longestPalindrome(s: string): string {
  if (!s) return '';
  let start = 0, maxLen = 1;
  const expand = (l: number, r: number): [number, number] => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l--; r++;
    }
    return [l + 1, r - 1 - l];
  };
  for (let i = 0; i < s.length; i++) {
    const [s1, len1] = expand(i, i);
    if (len1 > maxLen) { start = s1; maxLen = len1; }
    const [s2, len2] = expand(i, i + 1);
    if (len2 > maxLen) { start = s2; maxLen = len2; }
  }
  return s.substring(start, start + maxLen);
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/',
  neetcodeUrl: 'https://neetcode.io/problems/longest-palindromic-substring',
};
