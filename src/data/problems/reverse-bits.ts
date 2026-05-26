import type { Problem } from '../../types';

export const reverseBits: Problem = {
  id: 'reverse-bits',
  title: 'Reverse Bits',
  difficulty: 'Easy',
  topic: 'Bit Manipulation',
  order: 23,

  prompt: `Reverse the bits of a given 32-bit unsigned integer.

The input is given as a 32-bit unsigned integer; the output should also be a 32-bit unsigned integer with the bits in the reverse order.`,

  examples: [
    {
      input: 'n = 43261596',
      output: '964176192',
      explanation: '00000010100101000001111010011100 reversed is 00111001011110000010100101000000.',
    },
    {
      input: 'n = 4294967293',
      output: '3221225471',
      explanation: '11111111111111111111111111111101 reversed is 10111111111111111111111111111111.',
    },
  ],

  constraints: ['The input must be a binary string of length 32.', '0 <= n <= 2^32 - 1'],

  languages: {
    javascript: {
      functionName: 'reverseBits',
      starterCode: `function reverseBits(n) {

}`,
    },
    python: {
      functionName: 'reverse_bits',
      starterCode: `def reverse_bits(n):
    pass`,
    },
    typescript: {
      functionName: 'reverseBits',
      starterCode: `function reverseBits(n: number): number {
  return 0;
}`,
    },
  },

  tests: [
    { input: [43261596], expected: 964176192 },
    { input: [4294967293], expected: 3221225471 },
    { input: [0], expected: 0 },
    { input: [1], expected: 2147483648 },
    { input: [2147483648], expected: 1 },
  ],

  solutions: [
    {
      name: 'Bit-by-bit',
      timeComplexity: 'O(1) (always 32 iterations)',
      spaceComplexity: 'O(1)',
      explanation: `Loop 32 times. Each iteration: shift the result left by 1 (making room for the next bit), then OR in the low bit of \`n\`, then shift \`n\` right by 1. After 32 iterations, the result has \`n\`'s bits in reverse.

JavaScript needs \`>>> 0\` at the end to force an unsigned interpretation of the result. Python ints are arbitrary-precision so they need no special handling.`,
      code: {
        javascript: `function reverseBits(n) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (n & 1);
    n = n >>> 1;
  }
  return result >>> 0;
}`,
        python: `def reverse_bits(n):
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result`,
        typescript: `function reverseBits(n: number): number {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (n & 1);
    n = n >>> 1;
  }
  return result >>> 0;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/reverse-bits/',
  neetcodeUrl: 'https://neetcode.io/problems/reverse-bits',
};
