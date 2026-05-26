import type { Problem } from '../../types';

export const reorderList: Problem = {
  id: 'reorder-list',
  title: 'Reorder List',
  difficulty: 'Medium',
  topic: 'Linked List',
  order: 46,

  prompt: `You are given the head of a singly linked list. The list can be represented as:

\`L0 → L1 → … → Ln-1 → Ln\`

Reorder it to:

\`L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …\`

You **may not modify the values** in the list's nodes. Only the \`next\` pointers can be changed. The reordering happens in-place — you don't need to return anything (the runner will read from the input head).`,

  examples: [
    { input: 'head = [1,2,3,4]', output: '[1,4,2,3]' },
    { input: 'head = [1,2,3,4,5]', output: '[1,5,2,4,3]' },
  ],

  constraints: ['The number of nodes is in the range [1, 5 * 10^4].', '1 <= Node.val <= 1000'],

  languages: {
    javascript: {
      functionName: 'reorderList',
      starterCode: `function reorderList(head) {
  // Modify in place — no return needed
}`,
    },
    python: {
      functionName: 'reorder_list',
      starterCode: `def reorder_list(head):
    # Modify in place — no return needed
    pass`,
    },
    typescript: {
      functionName: 'reorderList',
      starterCode: `function reorderList(head: any): void {
  // Modify in place — no return needed
}`,
    },
  },

  inputKinds: ['list'],
  outputKind: 'list',

  tests: [
    { input: [[1, 2, 3, 4]], expected: [1, 4, 2, 3] },
    { input: [[1, 2, 3, 4, 5]], expected: [1, 5, 2, 4, 3] },
    { input: [[1, 2]], expected: [1, 2] },
    { input: [[1]], expected: [1] },
    { input: [[1, 2, 3]], expected: [1, 3, 2] },
  ],

  solutions: [
    {
      name: 'Find middle → reverse second half → merge',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `Three classic linked-list techniques in sequence:
1. **Find the middle** with slow/fast pointers.
2. **Reverse** the second half.
3. **Merge** the two halves by alternating nodes.

Break the original list at the middle so the second half is independent before reversing it.`,
      code: {
        javascript: `function reorderList(head) {
  if (!head || !head.next) return;

  // 1. Find middle
  let slow = head, fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // 2. Reverse second half
  let prev = null, cur = slow.next;
  slow.next = null;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }

  // 3. Merge alternately
  let first = head, second = prev;
  while (second) {
    const t1 = first.next, t2 = second.next;
    first.next = second;
    second.next = t1;
    first = t1;
    second = t2;
  }
}`,
        python: `def reorder_list(head):
    if not head or not head.next:
        return

    # 1. Find middle
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next

    # 2. Reverse second half
    prev, cur = None, slow.next
    slow.next = None
    while cur:
        nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt

    # 3. Merge alternately
    first, second = head, prev
    while second:
        t1, t2 = first.next, second.next
        first.next = second
        second.next = t1
        first, second = t1, t2`,
        typescript: `function reorderList(head: any): void {
  if (!head || !head.next) return;

  let slow = head, fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  let prev: any = null, cur = slow.next;
  slow.next = null;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }

  let first = head, second = prev;
  while (second) {
    const t1 = first.next, t2 = second.next;
    first.next = second;
    second.next = t1;
    first = t1;
    second = t2;
  }
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/reorder-list/',
  neetcodeUrl: 'https://neetcode.io/problems/reorder-linked-list',
};
