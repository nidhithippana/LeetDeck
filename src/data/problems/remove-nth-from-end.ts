import type { Problem } from '../../types';

export const removeNthFromEnd: Problem = {
  id: 'remove-nth-from-end',
  title: 'Remove Nth Node From End of List',
  difficulty: 'Medium',
  topic: 'Linked List',
  order: 45,

  prompt: `Given the \`head\` of a linked list, remove the \`n\`-th node **from the end** of the list and return its head.

Try to do this in one pass.`,

  examples: [
    { input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]' },
    { input: 'head = [1], n = 1', output: '[]' },
    { input: 'head = [1,2], n = 1', output: '[1]' },
  ],

  constraints: ['The number of nodes is sz.', '1 <= sz <= 30', '0 <= Node.val <= 100', '1 <= n <= sz'],

  languages: {
    javascript: {
      functionName: 'removeNthFromEnd',
      starterCode: `function removeNthFromEnd(head, n) {

}`,
    },
    python: {
      functionName: 'remove_nth_from_end',
      starterCode: `def remove_nth_from_end(head, n):
    pass`,
    },
    typescript: {
      functionName: 'removeNthFromEnd',
      starterCode: `function removeNthFromEnd(head: any, n: number): any {
  return null;
}`,
    },
  },

  inputKinds: ['list', 'primitive'],
  outputKind: 'list',

  tests: [
    { input: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] },
    { input: [[1], 1], expected: [] },
    { input: [[1, 2], 1], expected: [1] },
    { input: [[1, 2], 2], expected: [2] },
    { input: [[1, 2, 3], 3], expected: [2, 3] },
  ],

  solutions: [
    {
      name: 'Two Pointers, One Pass',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `Use a dummy node before the head so we can uniformly handle removing the first node. Advance \`fast\` \`n\` steps ahead, then move \`fast\` and \`slow\` together until \`fast\` falls off the end. At that point \`slow\` is sitting on the node *just before* the one to remove. Unlink and return \`dummy.next\`.`,
      code: {
        javascript: `function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let slow = dummy, fast = dummy;
  for (let i = 0; i < n; i++) fast = fast.next;
  while (fast.next) {
    slow = slow.next;
    fast = fast.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}`,
        python: `def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    slow = fast = dummy
    for _ in range(n):
        fast = fast.next
    while fast.next:
        slow = slow.next
        fast = fast.next
    slow.next = slow.next.next
    return dummy.next`,
        typescript: `function removeNthFromEnd(head: any, n: number): any {
  const dummy: any = new (globalThis as any).ListNode(0, head);
  let slow = dummy, fast = dummy;
  for (let i = 0; i < n; i++) fast = fast.next;
  while (fast.next) {
    slow = slow.next;
    fast = fast.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
  neetcodeUrl: 'https://neetcode.io/problems/remove-node-from-end-of-linked-list',
};
