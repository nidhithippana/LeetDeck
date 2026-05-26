import type { Problem } from '../../types';

export const validAnagram: Problem = {
  id: 'valid-anagram',
  title: 'Valid Anagram',
  difficulty: 'Easy',
  topic: 'Arrays & Hashing',
  order: 3,

  prompt: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **anagram** is a word formed by rearranging the letters of another word, using all the original letters exactly once.`,

  examples: [
    { input: 's = "anagram", t = "nagaram"', output: 'true' },
    { input: 's = "rat", t = "car"', output: 'false' },
  ],

  constraints: [
    '1 <= s.length, t.length <= 5 * 10^4',
    's and t consist of lowercase English letters.',
  ],

  languages: {
    javascript: {
      functionName: 'isAnagram',
      starterCode: `function isAnagram(s, t) {

}`,
    },
    python: {
      functionName: 'is_anagram',
      starterCode: `def is_anagram(s, t):
    pass`,
    },
    typescript: {
      functionName: 'isAnagram',
      starterCode: `function isAnagram(s: string, t: string): boolean {
  return false;
}`,
    },
  },

  tests: [
    { input: ['anagram', 'nagaram'], expected: true },
    { input: ['rat', 'car'], expected: false },
    { input: ['', ''], expected: true },
    { input: ['a', 'ab'], expected: false },
    { input: ['listen', 'silent'], expected: true },
  ],

  solutions: [
    {
      name: 'Sort Both',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      explanation: `Two strings are anagrams iff their sorted forms are equal. Easy to write, but sorting costs O(n log n).`,
      code: {
        javascript: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  return [...s].sort().join('') === [...t].sort().join('');
}`,
        python: `def is_anagram(s, t):
    return sorted(s) == sorted(t)`,
        typescript: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  return [...s].sort().join('') === [...t].sort().join('');
}`,
      },
    },
    {
      name: 'Character Count',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `Increment for each letter in \`s\`, decrement for each letter in \`t\`. If they're anagrams, every count cancels to zero. Space is O(1) because the alphabet is fixed at 26.`,
      code: {
        javascript: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
  }
  return count.every(c => c === 0);
}`,
        python: `def is_anagram(s, t):
    if len(s) != len(t):
        return False
    count = [0] * 26
    for cs, ct in zip(s, t):
        count[ord(cs) - 97] += 1
        count[ord(ct) - 97] -= 1
    return all(c == 0 for c in count)`,
        typescript: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const count = new Array<number>(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
  }
  return count.every((c) => c === 0);
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/',
  neetcodeUrl: 'https://neetcode.io/problems/is-anagram',
};
