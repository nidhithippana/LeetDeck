import type { Problem } from '../../types';

export const reverseLinkedList: Problem = {
  id: 'reverse-linked-list',
  title: 'Reverse Linked List',
  difficulty: 'Easy',
  topic: 'Linked List',
  order: 42,

  prompt: `Given the \`head\` of a singly linked list, reverse the list, and return the new head.

A \`ListNode\` class is provided with \`val\` and \`next\` fields.`,

  examples: [
    { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
    { input: 'head = [1,2]', output: '[2,1]' },
    { input: 'head = []', output: '[]' },
  ],

  constraints: ['The number of nodes is in the range [0, 5000].', '-5000 <= Node.val <= 5000'],

  languages: {
    javascript: {
      functionName: 'reverseList',
      starterCode: `function reverseList(head) {

}`,
    },
    python: {
      functionName: 'reverse_list',
      starterCode: `def reverse_list(head):
    pass`,
    },
    typescript: {
      functionName: 'reverseList',
      starterCode: `function reverseList(head: any): any {
  return null;
}`,
    },
  },

  inputKinds: ['list'],
  outputKind: 'list',

  tests: [
    { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
    { input: [[1, 2]], expected: [2, 1] },
    { input: [[]], expected: [] },
    { input: [[1]], expected: [1] },
  ],

  solutions: [
    {
      name: 'Iterative Three Pointers',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `Walk the list with three pointers: \`prev\`, \`cur\`, and \`next\`. At each step, save \`cur.next\`, rewire \`cur.next = prev\`, then advance \`prev = cur\` and \`cur = next\`. When the loop ends, \`prev\` is the new head.`,
      code: {
        javascript: `function reverseList(head) {
  let prev = null, cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}`,
        python: `def reverse_list(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt
    return prev`,
        typescript: `function reverseList(head: any): any {
  let prev: any = null;
  let cur: any = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}`,
      },
    },
    {
      name: 'Recursive',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n) recursion stack',
      explanation: `Recursively reverse \`head.next\`, which returns the new head of the reversed tail. Now point \`head.next.next\` back to \`head\` and break \`head.next\`. Return the new head.`,
      code: {
        javascript: `function reverseList(head) {
  if (!head || !head.next) return head;
  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}`,
        python: `def reverse_list(head):
    if not head or not head.next:
        return head
    new_head = reverse_list(head.next)
    head.next.next = head
    head.next = None
    return new_head`,
        typescript: `function reverseList(head: any): any {
  if (!head || !head.next) return head;
  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
  neetcodeUrl: 'https://neetcode.io/problems/reverse-a-linked-list',
};
