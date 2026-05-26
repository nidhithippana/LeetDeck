import type { Problem } from '../../types';

export const groupAnagrams: Problem = {
  id: 'group-anagrams',
  title: 'Group Anagrams',
  difficulty: 'Medium',
  topic: 'Arrays & Hashing',
  order: 11,

  prompt: `Given an array of strings \`strs\`, group the **anagrams** together. You can return the answer in any order (both the outer list and inner lists can be in any order).

An **anagram** is a word formed by rearranging the letters of another word, using all the original letters exactly once.`,

  examples: [
    { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
    { input: 'strs = [""]', output: '[[""]]' },
    { input: 'strs = ["a"]', output: '[["a"]]' },
  ],

  constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters.'],

  languages: {
    javascript: {
      functionName: 'groupAnagrams',
      starterCode: `function groupAnagrams(strs) {

}`,
    },
    python: {
      functionName: 'group_anagrams',
      starterCode: `def group_anagrams(strs):
    pass`,
    },
    typescript: {
      functionName: 'groupAnagrams',
      starterCode: `function groupAnagrams(strs: string[]): string[][] {
  return [];
}`,
    },
  },

  tests: [
    {
      input: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']],
      expected: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']],
      unordered: true,
    },
    { input: [['']], expected: [['']], unordered: true },
    { input: [['a']], expected: [['a']], unordered: true },
    {
      input: [['abc', 'cba', 'bac', 'xyz', 'zyx', 'foo']],
      expected: [['abc', 'cba', 'bac'], ['xyz', 'zyx'], ['foo']],
      unordered: true,
    },
  ],

  solutions: [
    {
      name: 'Sorted Key',
      timeComplexity: 'O(n · k log k)',
      spaceComplexity: 'O(n · k)',
      explanation: `Anagrams share the same sorted form, so use the sorted string as a hash-map key. \`k\` is the max word length, \`n\` is the number of words. Group by key, return the values.`,
      code: {
        javascript: `function groupAnagrams(strs) {
  const groups = new Map();
  for (const s of strs) {
    const key = [...s].sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return [...groups.values()];
}`,
        python: `def group_anagrams(strs):
    groups = {}
    for s in strs:
        key = ''.join(sorted(s))
        groups.setdefault(key, []).append(s)
    return list(groups.values())`,
        typescript: `function groupAnagrams(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();
  for (const s of strs) {
    const key = [...s].sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(s);
  }
  return [...groups.values()];
}`,
      },
    },
    {
      name: 'Character Count Key',
      timeComplexity: 'O(n · k)',
      spaceComplexity: 'O(n · k)',
      explanation: `Skip the sort: build a 26-character count signature as the key. \`a3b1c0...\` collisions iff anagrams. Faster than sorting for large \`k\`.`,
      code: {
        javascript: `function groupAnagrams(strs) {
  const groups = new Map();
  for (const s of strs) {
    const count = new Array(26).fill(0);
    for (const c of s) count[c.charCodeAt(0) - 97]++;
    const key = count.join(',');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return [...groups.values()];
}`,
        python: `def group_anagrams(strs):
    groups = {}
    for s in strs:
        count = [0] * 26
        for c in s:
            count[ord(c) - 97] += 1
        key = tuple(count)
        groups.setdefault(key, []).append(s)
    return list(groups.values())`,
        typescript: `function groupAnagrams(strs: string[]): string[][] {
  const groups = new Map<string, string[]>();
  for (const s of strs) {
    const count = new Array<number>(26).fill(0);
    for (const c of s) count[c.charCodeAt(0) - 97]++;
    const key = count.join(',');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(s);
  }
  return [...groups.values()];
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/',
  neetcodeUrl: 'https://neetcode.io/problems/anagram-groups',
};
