import type { Problem } from '../../types';

export const numberOfOneBits: Problem = {
  id: 'number-of-1-bits',
  title: 'Number of 1 Bits',
  difficulty: 'Easy',
  topic: 'Bit Manipulation',
  order: 20,

  prompt: `Write a function that takes the binary representation of a positive integer and returns the number of **set bits** it has (also known as the Hamming weight).`,

  examples: [
    { input: 'n = 11', output: '3', explanation: 'Binary: 0000 1011 → three 1 bits.' },
    { input: 'n = 128', output: '1', explanation: 'Binary: 1000 0000 → one 1 bit.' },
    { input: 'n = 2147483645', output: '30', explanation: 'Maximum 32-bit signed minus a couple of bits.' },
  ],

  constraints: ['1 <= n <= 2^31 - 1'],

  languages: {
    javascript: {
      functionName: 'hammingWeight',
      starterCode: `function hammingWeight(n) {

}`,
    },
    python: {
      functionName: 'hamming_weight',
      starterCode: `def hamming_weight(n):
    pass`,
    },
    typescript: {
      functionName: 'hammingWeight',
      starterCode: `function hammingWeight(n: number): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: [11], expected: 3 },
    { input: [128], expected: 1 },
    { input: [2147483645], expected: 30 },
    { input: [0], expected: 0 },
    { input: [1], expected: 1 },
    { input: [7], expected: 3 },
  ],

  solutions: [
    {
      name: "Brian Kernighan's Trick",
      timeComplexity: 'O(k) where k = number of set bits',
      spaceComplexity: 'O(1)',
      explanation: `\`n & (n - 1)\` clears the **lowest** set bit. So count how many times you can do that before \`n\` becomes 0. Much faster than checking every bit when there are few 1s.`,
      code: {
        javascript: `function hammingWeight(n) {
  let count = 0;
  while (n !== 0) {
    n = n & (n - 1);
    count++;
  }
  return count;
}`,
        python: `def hamming_weight(n):
    count = 0
    while n != 0:
        n = n & (n - 1)
        count += 1
    return count`,
        typescript: `function hammingWeight(n: number): number {
  let count = 0;
  while (n !== 0) {
    n = n & (n - 1);
    count++;
  }
  return count;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/number-of-1-bits/',
  neetcodeUrl: 'https://neetcode.io/problems/number-of-one-bits',
};
