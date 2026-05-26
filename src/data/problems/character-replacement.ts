import type { Problem } from '../../types';

export const characterReplacement: Problem = {
  id: 'character-replacement',
  title: 'Longest Repeating Character Replacement',
  difficulty: 'Medium',
  topic: 'Sliding Window',
  order: 17,

  prompt: `You are given a string \`s\` and an integer \`k\`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most \`k\` times.

Return the length of the longest substring containing the **same letter** you can get after performing the above operations.`,

  examples: [
    { input: 's = "ABAB", k = 2', output: '4', explanation: 'Replace the two A\'s with B\'s (or vice versa).' },
    { input: 's = "AABABBA", k = 1', output: '4', explanation: 'Replace the one A in the middle with B → "AABBBBA", longest is "BBBB".' },
  ],

  constraints: ['1 <= s.length <= 10^5', 's consists of uppercase English letters.', '0 <= k <= s.length'],

  languages: {
    javascript: {
      functionName: 'characterReplacement',
      starterCode: `function characterReplacement(s, k) {

}`,
    },
    python: {
      functionName: 'character_replacement',
      starterCode: `def character_replacement(s, k):
    pass`,
    },
    typescript: {
      functionName: 'characterReplacement',
      starterCode: `function characterReplacement(s: string, k: number): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: ['ABAB', 2], expected: 4 },
    { input: ['AABABBA', 1], expected: 4 },
    { input: ['A', 0], expected: 1 },
    { input: ['ABCD', 1], expected: 2 },
    { input: ['ABCD', 0], expected: 1 },
    { input: ['AAAA', 2], expected: 4 },
  ],

  solutions: [
    {
      name: 'Sliding Window with Max Count',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `Maintain a window \`[l, r]\` and a count of each character in it. A window is valid if \`window_size - max_count <= k\` (the "non-dominant" chars are at most \`k\`). When invalid, slide \`l\` right. Track max window size.

We don't need to recompute \`maxCount\` on shrink — the answer only grows when \`maxCount\` increases, so a stale-but-cached \`maxCount\` is safe.`,
      code: {
        javascript: `function characterReplacement(s, k) {
  const count = new Array(26).fill(0);
  let l = 0, maxCount = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    const i = s.charCodeAt(r) - 65;
    count[i]++;
    if (count[i] > maxCount) maxCount = count[i];
    if ((r - l + 1) - maxCount > k) {
      count[s.charCodeAt(l) - 65]--;
      l++;
    }
    if (r - l + 1 > best) best = r - l + 1;
  }
  return best;
}`,
        python: `def character_replacement(s, k):
    count = [0] * 26
    l = max_count = best = 0
    for r in range(len(s)):
        i = ord(s[r]) - 65
        count[i] += 1
        if count[i] > max_count:
            max_count = count[i]
        if (r - l + 1) - max_count > k:
            count[ord(s[l]) - 65] -= 1
            l += 1
        best = max(best, r - l + 1)
    return best`,
        typescript: `function characterReplacement(s: string, k: number): number {
  const count = new Array<number>(26).fill(0);
  let l = 0, maxCount = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    const i = s.charCodeAt(r) - 65;
    count[i]++;
    if (count[i] > maxCount) maxCount = count[i];
    if ((r - l + 1) - maxCount > k) {
      count[s.charCodeAt(l) - 65]--;
      l++;
    }
    if (r - l + 1 > best) best = r - l + 1;
  }
  return best;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/longest-repeating-character-replacement/',
  neetcodeUrl: 'https://neetcode.io/problems/longest-repeating-substring-with-replacement',
};
