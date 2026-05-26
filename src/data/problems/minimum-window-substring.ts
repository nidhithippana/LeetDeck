import type { Problem } from '../../types';

export const minimumWindowSubstring: Problem = {
  id: 'minimum-window-substring',
  title: 'Minimum Window Substring',
  difficulty: 'Hard',
  topic: 'Sliding Window',
  order: 68,

  prompt: `Given two strings \`s\` and \`t\` of lengths \`m\` and \`n\` respectively, return the **minimum window substring** of \`s\` such that every character in \`t\` (including duplicates) is included in the window. If there is no such substring, return an empty string \`""\`.

The answer is guaranteed to be unique.`,

  examples: [
    { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' },
    { input: 's = "a", t = "a"', output: '"a"' },
    { input: 's = "a", t = "aa"', output: '""', explanation: 'Only one "a" — can\'t cover two.' },
  ],

  constraints: ['m == s.length, n == t.length', '1 <= m, n <= 10^5', 's and t consist of uppercase and lowercase English letters.'],

  languages: {
    javascript: {
      functionName: 'minWindow',
      starterCode: `function minWindow(s, t) {

}`,
    },
    python: {
      functionName: 'min_window',
      starterCode: `def min_window(s, t):
    pass`,
    },
    typescript: {
      functionName: 'minWindow',
      starterCode: `function minWindow(s: string, t: string): string {
  return '';
}`,
    },
  },

  tests: [
    { input: ['ADOBECODEBANC', 'ABC'], expected: 'BANC' },
    { input: ['a', 'a'], expected: 'a' },
    { input: ['a', 'aa'], expected: '' },
    { input: ['aa', 'aa'], expected: 'aa' },
    { input: ['ab', 'b'], expected: 'b' },
  ],

  solutions: [
    {
      name: 'Sliding Window with Char Count',
      timeComplexity: 'O(m + n)',
      spaceComplexity: 'O(charset)',
      explanation: `Maintain a window \`[l, r]\` and a "needs" counter for each char of \`t\`. Track how many distinct chars are **satisfied** (count in window ≥ needed count).

Expand \`r\` until the window covers all of \`t\` (all chars satisfied). Then shrink \`l\` as far as possible while still satisfied, updating the best window each time. Repeat.`,
      code: {
        javascript: `function minWindow(s, t) {
  if (t.length > s.length) return '';
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  let have = 0, required = need.size;
  let bestLen = Infinity, bestL = 0;
  const have_count = new Map();
  let l = 0;
  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    have_count.set(c, (have_count.get(c) ?? 0) + 1);
    if (need.has(c) && have_count.get(c) === need.get(c)) have++;
    while (have === required) {
      if (r - l + 1 < bestLen) {
        bestLen = r - l + 1;
        bestL = l;
      }
      const lc = s[l];
      have_count.set(lc, have_count.get(lc) - 1);
      if (need.has(lc) && have_count.get(lc) < need.get(lc)) have--;
      l++;
    }
  }
  return bestLen === Infinity ? '' : s.substring(bestL, bestL + bestLen);
}`,
        python: `def min_window(s, t):
    if len(t) > len(s):
        return ''
    from collections import Counter
    need = Counter(t)
    have = 0
    required = len(need)
    have_count = {}
    best_len, best_l = float('inf'), 0
    l = 0
    for r, c in enumerate(s):
        have_count[c] = have_count.get(c, 0) + 1
        if c in need and have_count[c] == need[c]:
            have += 1
        while have == required:
            if r - l + 1 < best_len:
                best_len = r - l + 1
                best_l = l
            lc = s[l]
            have_count[lc] -= 1
            if lc in need and have_count[lc] < need[lc]:
                have -= 1
            l += 1
    return '' if best_len == float('inf') else s[best_l:best_l + best_len]`,
        typescript: `function minWindow(s: string, t: string): string {
  if (t.length > s.length) return '';
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  let have = 0;
  const required = need.size;
  let bestLen = Infinity, bestL = 0;
  const haveCount = new Map<string, number>();
  let l = 0;
  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    haveCount.set(c, (haveCount.get(c) ?? 0) + 1);
    if (need.has(c) && haveCount.get(c) === need.get(c)) have++;
    while (have === required) {
      if (r - l + 1 < bestLen) {
        bestLen = r - l + 1;
        bestL = l;
      }
      const lc = s[l];
      haveCount.set(lc, haveCount.get(lc)! - 1);
      if (need.has(lc) && haveCount.get(lc)! < need.get(lc)!) have--;
      l++;
    }
  }
  return bestLen === Infinity ? '' : s.substring(bestL, bestL + bestLen);
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/',
  neetcodeUrl: 'https://neetcode.io/problems/minimum-window-with-characters',
};
