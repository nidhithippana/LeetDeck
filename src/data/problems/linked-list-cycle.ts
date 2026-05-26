import type { Problem } from '../../types';

export const linkedListCycle: Problem = {
  id: 'linked-list-cycle',
  title: 'Linked List Cycle',
  difficulty: 'Easy',
  topic: 'Linked List',
  order: 44,

  prompt: `Given the head of a linked list, return \`true\` if the linked list has a cycle in it.

There is a cycle if some node in the list can be reached again by continuously following the \`next\` pointer.

**Test input format:** each test passes \`[values, pos]\` where \`pos\` is the 0-based index that the tail's \`.next\` connects to (\`-1\` if no cycle). The runner wires up the actual cycle before calling your function — your function just receives a \`head\` (possibly with a cycle).

Solve it with \`O(1)\` extra space.`,

  examples: [
    { input: 'head = [3,2,0,-4], pos = 1', output: 'true', explanation: 'Tail connects back to index 1 (value 2).' },
    { input: 'head = [1,2], pos = 0', output: 'true' },
    { input: 'head = [1], pos = -1', output: 'false' },
  ],

  constraints: ['0 <= length <= 10^4', '-10^5 <= Node.val <= 10^5', '-1 <= pos < length'],

  languages: {
    javascript: {
      functionName: 'hasCycle',
      starterCode: `function hasCycle(head) {

}`,
    },
    python: {
      functionName: 'has_cycle',
      starterCode: `def has_cycle(head):
    pass`,
    },
    typescript: {
      functionName: 'hasCycle',
      starterCode: `function hasCycle(head: any): boolean {
  return false;
}`,
    },
  },

  inputKinds: ['list-with-cycle'],
  outputKind: 'primitive',

  tests: [
    { input: [[[3, 2, 0, -4], 1]], expected: true },
    { input: [[[1, 2], 0]], expected: true },
    { input: [[[1], -1]], expected: false },
    { input: [[[1, 2], -1]], expected: false },
    { input: [[[], -1]], expected: false },
    { input: [[[1, 2, 3, 4, 5], 2]], expected: true },
  ],

  solutions: [
    {
      name: "Floyd's Tortoise and Hare",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: `Walk two pointers: \`slow\` advances 1 step at a time, \`fast\` advances 2. If there's a cycle, \`fast\` will eventually lap \`slow\` and they'll meet. If there's no cycle, \`fast\` reaches \`null\` first. No extra storage needed.`,
      code: {
        javascript: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
        python: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
        typescript: `function hasCycle(head: any): boolean {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/',
  neetcodeUrl: 'https://neetcode.io/problems/linked-list-cycle-detection',
};
