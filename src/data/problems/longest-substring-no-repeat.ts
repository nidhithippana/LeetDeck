import type { Problem } from '../../types';

export const longestSubstringNoRepeat: Problem = {
  id: 'longest-substring-no-repeat',
  title: 'Longest Substring Without Repeating Characters',
  difficulty: 'Medium',
  topic: 'Sliding Window',
  order: 16,

  prompt: `Given a string \`s\`, find the length of the longest **substring** without repeating characters.`,

  examples: [
    { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with length 3.' },
    { input: 's = "bbbbb"', output: '1' },
    { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke" — note "pwke" is a subsequence, not a substring.' },
  ],

  constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols, and spaces.'],

  languages: {
    javascript: {
      functionName: 'lengthOfLongestSubstring',
      starterCode: `function lengthOfLongestSubstring(s) {

}`,
    },
    python: {
      functionName: 'length_of_longest_substring',
      starterCode: `def length_of_longest_substring(s):
    pass`,
    },
    typescript: {
      functionName: 'lengthOfLongestSubstring',
      starterCode: `function lengthOfLongestSubstring(s: string): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: ['abcabcbb'], expected: 3 },
    { input: ['bbbbb'], expected: 1 },
    { input: ['pwwkew'], expected: 3 },
    { input: [''], expected: 0 },
    { input: ['au'], expected: 2 },
    { input: [' '], expected: 1 },
    { input: ['dvdf'], expected: 3 },
  ],

  solutions: [
    {
      name: 'Sliding Window with Hash Set',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(min(n, alphabet))',
      explanation: `Maintain a window \`[l, r]\` containing only unique chars. Walk \`r\` forward; if the new char is already in the window, shrink from the left until it isn't. Track the max window size.`,
      code: {
        javascript: `function lengthOfLongestSubstring(s) {
  const seen = new Set();
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    while (seen.has(s[r])) {
      seen.delete(s[l]);
      l++;
    }
    seen.add(s[r]);
    if (r - l + 1 > best) best = r - l + 1;
  }
  return best;
}`,
        python: `def length_of_longest_substring(s):
    seen = set()
    l = best = 0
    for r in range(len(s)):
        while s[r] in seen:
            seen.remove(s[l])
            l += 1
        seen.add(s[r])
        best = max(best, r - l + 1)
    return best`,
        typescript: `function lengthOfLongestSubstring(s: string): number {
  const seen = new Set<string>();
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    while (seen.has(s[r])) {
      seen.delete(s[l]);
      l++;
    }
    seen.add(s[r]);
    if (r - l + 1 > best) best = r - l + 1;
  }
  return best;
}`,
      },
    },
    {
      name: 'Sliding Window with Index Map (jump)',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(min(n, alphabet))',
      explanation: `Same idea, but instead of shrinking one step at a time, jump \`l\` directly past the previous occurrence of the repeat. Same complexity, fewer operations.`,
      code: {
        javascript: `function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    const prev = lastSeen.get(s[r]);
    if (prev !== undefined && prev >= l) l = prev + 1;
    lastSeen.set(s[r], r);
    if (r - l + 1 > best) best = r - l + 1;
  }
  return best;
}`,
        python: `def length_of_longest_substring(s):
    last_seen = {}
    l = best = 0
    for r, c in enumerate(s):
        if c in last_seen and last_seen[c] >= l:
            l = last_seen[c] + 1
        last_seen[c] = r
        best = max(best, r - l + 1)
    return best`,
        typescript: `function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>();
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    const prev = lastSeen.get(s[r]);
    if (prev !== undefined && prev >= l) l = prev + 1;
    lastSeen.set(s[r], r);
    if (r - l + 1 > best) best = r - l + 1;
  }
  return best;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
  neetcodeUrl: 'https://neetcode.io/problems/longest-substring-without-duplicates',
};
