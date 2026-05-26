import type { Problem } from '../../types';

export const sumTwoIntegers: Problem = {
  id: 'sum-two-integers',
  title: 'Sum of Two Integers',
  difficulty: 'Medium',
  topic: 'Bit Manipulation',
  order: 19,

  prompt: `Given two integers \`a\` and \`b\`, return the sum of the two integers **without using the operators \`+\` and \`-\`**.

You're meant to use bitwise operations: XOR computes the sum without carry, AND-then-left-shift computes just the carry, and repeating gives you the final sum.`,

  examples: [
    { input: 'a = 1, b = 2', output: '3' },
    { input: 'a = 2, b = 3', output: '5' },
    { input: 'a = -1, b = 1', output: '0' },
  ],

  constraints: ['-1000 <= a, b <= 1000'],

  languages: {
    javascript: {
      functionName: 'getSum',
      starterCode: `function getSum(a, b) {

}`,
    },
    python: {
      functionName: 'get_sum',
      starterCode: `def get_sum(a, b):
    pass`,
    },
    typescript: {
      functionName: 'getSum',
      starterCode: `function getSum(a: number, b: number): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: [1, 2], expected: 3 },
    { input: [2, 3], expected: 5 },
    { input: [-1, 1], expected: 0 },
    { input: [-2, 3], expected: 1 },
    { input: [0, 0], expected: 0 },
    { input: [-5, -3], expected: -8 },
    { input: [100, 200], expected: 300 },
  ],

  solutions: [
    {
      name: 'Bitwise Add',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      explanation: `\`a ^ b\` gives the sum of each bit position **without** carry. \`(a & b) << 1\` gives just the carries. Adding the two gives the real sum — but we can't use \`+\`, so we recurse: keep XORing the running sum with the running carry until the carry is zero.

JavaScript's bitwise operators work on 32-bit signed integers natively, so this just works for negatives. Python needs explicit 32-bit masking + a manual sign reconstruction at the end.`,
      code: {
        javascript: `function getSum(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}`,
        python: `def get_sum(a, b):
    MASK = 0xFFFFFFFF
    MAX_INT = 0x7FFFFFFF
    while b != 0:
        a, b = (a ^ b) & MASK, ((a & b) << 1) & MASK
    return a if a <= MAX_INT else ~(a ^ MASK)`,
        typescript: `function getSum(a: number, b: number): number {
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/sum-of-two-integers/',
  neetcodeUrl: 'https://neetcode.io/problems/sum-of-two-integers',
};
