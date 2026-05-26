import type { Problem } from '../../types';

export const validPalindrome: Problem = {
  id: 'valid-palindrome',
  title: 'Valid Palindrome',
  difficulty: 'Easy',
  topic: 'Two Pointers',
  order: 5,

  prompt: `A phrase is a **palindrome** if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,

  examples: [
    { input: 's = "A man, a plan, a canal: Panama"', output: 'true' },
    { input: 's = "race a car"', output: 'false' },
    { input: 's = " "', output: 'true', explanation: 'After removing non-alphanumeric chars, the string is empty — empty reads the same either way.' },
  ],

  constraints: [
    '1 <= s.length <= 2 * 10^5',
    's consists only of printable ASCII characters.',
  ],

  languages: {
    javascript: {
      functionName: 'isPalindrome',
      starterCode: `function isPalindrome(s) {

}`,
    },
    python: {
      functionName: 'is_palindrome',
      starterCode: `def is_palindrome(s):
    pass`,
    },
    typescript: {
      functionName: 'isPalindrome',
      starterCode: `function isPalindrome(s: string): boolean {
  return false;
}`,
    },
  },

  tests: [
    { input: ['A man, a plan, a canal: Panama'], expected: true },
    { input: ['race a car'], expected: false },
    { input: [' '], expected: true },
    { input: ['0P'], expected: false },
    { input: ['ab_a'], expected: true },
  ],

  solutions: [
    {
      name: 'Clean + Reverse',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: `Strip and lowercase, then compare to its reverse. Concise but allocates two copies of the string.`,
      code: {
        javascript: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === [...clean].reverse().join('');
}`,
        python: `def is_palindrome(s):
    clean = ''.join(c.lower() for c in s if c.isalnum())
    return clean == clean[::-1]`,
        typescript: `function isPalindrome(s: string): boolean {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === [...clean].reverse().join('');
}`,
      },
    },
    {
      name: 'Two Pointers',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `Walk one pointer in from each end, skipping non-alphanumerics. If the characters they land on ever disagree, it's not a palindrome. No extra string allocation.`,
      code: {
        javascript: `function isPalindrome(s) {
  const isAlnum = c => /[a-z0-9]/i.test(c);
  let l = 0, r = s.length - 1;
  while (l < r) {
    while (l < r && !isAlnum(s[l])) l++;
    while (l < r && !isAlnum(s[r])) r--;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++; r--;
  }
  return true;
}`,
        python: `def is_palindrome(s):
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum():
            l += 1
        while l < r and not s[r].isalnum():
            r -= 1
        if s[l].lower() != s[r].lower():
            return False
        l += 1
        r -= 1
    return True`,
        typescript: `function isPalindrome(s: string): boolean {
  const isAlnum = (c: string) => /[a-z0-9]/i.test(c);
  let l = 0, r = s.length - 1;
  while (l < r) {
    while (l < r && !isAlnum(s[l])) l++;
    while (l < r && !isAlnum(s[r])) r--;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++; r--;
  }
  return true;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/',
  neetcodeUrl: 'https://neetcode.io/problems/is-palindrome',
};
