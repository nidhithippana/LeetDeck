import type { Problem } from '../../types';

export const validParentheses: Problem = {
  id: 'valid-parentheses',
  title: 'Valid Parentheses',
  difficulty: 'Easy',
  topic: 'Stack',
  order: 6,

  prompt: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

A string is valid if:
1. Open brackets are closed by the same type of brackets.
2. Open brackets are closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,

  examples: [
    { input: 's = "()"', output: 'true' },
    { input: 's = "()[]{}"', output: 'true' },
    { input: 's = "(]"', output: 'false' },
    { input: 's = "([)]"', output: 'false', explanation: 'Brackets must close in order.' },
  ],

  constraints: ['1 <= s.length <= 10^4', "s consists of parentheses only '()[]{}'."],

  languages: {
    javascript: {
      functionName: 'isValid',
      starterCode: `function isValid(s) {

}`,
    },
    python: {
      functionName: 'is_valid',
      starterCode: `def is_valid(s):
    pass`,
    },
    typescript: {
      functionName: 'isValid',
      starterCode: `function isValid(s: string): boolean {
  return false;
}`,
    },
  },

  tests: [
    { input: ['()'], expected: true },
    { input: ['()[]{}'], expected: true },
    { input: ['(]'], expected: false },
    { input: ['([)]'], expected: false },
    { input: ['{[]}'], expected: true },
    { input: [''], expected: true },
    { input: ['('], expected: false },
  ],

  solutions: [
    {
      name: 'Stack',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: `Push opening brackets onto a stack. On every closing bracket, pop and check it's the matching open. At the end the stack must be empty. The stack naturally enforces ordering.`,
      code: {
        javascript: `function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}`,
        python: `def is_valid(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        else:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return len(stack) == 0`,
        typescript: `function isValid(s: string): boolean {
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  const stack: string[] = [];
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/',
  neetcodeUrl: 'https://neetcode.io/problems/validate-parentheses',
};
