import type { Problem } from '../../types';

export const mergeKSortedLists: Problem = {
  id: 'merge-k-sorted-lists',
  title: 'Merge K Sorted Lists',
  difficulty: 'Hard',
  topic: 'Linked List',
  order: 72,

  prompt: `You are given an array of \`k\` linked lists \`lists\`, each sorted in ascending order.

Merge all the linked lists into one **sorted** linked list and return its head.`,

  examples: [
    { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
    { input: 'lists = []', output: '[]' },
    { input: 'lists = [[]]', output: '[]' },
  ],

  constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500', '-10^4 <= lists[i][j] <= 10^4'],

  languages: {
    javascript: {
      functionName: 'mergeKLists',
      starterCode: `function mergeKLists(lists) {

}`,
    },
    python: {
      functionName: 'merge_k_lists',
      starterCode: `def merge_k_lists(lists):
    pass`,
    },
    typescript: {
      functionName: 'mergeKLists',
      starterCode: `function mergeKLists(lists: any[]): any {
  return null;
}`,
    },
  },

  inputKinds: ['list-array'],
  outputKind: 'list',

  tests: [
    { input: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expected: [1, 1, 2, 3, 4, 4, 5, 6] },
    { input: [[]], expected: [] },
    { input: [[[]]], expected: [] },
    { input: [[[1]]], expected: [1] },
    { input: [[[1, 2], [3, 4], [5, 6]]], expected: [1, 2, 3, 4, 5, 6] },
  ],

  solutions: [
    {
      name: 'Pairwise Merge (Divide and Conquer)',
      timeComplexity: 'O(N log k) where N = total nodes',
      spaceComplexity: 'O(1)',
      explanation: `Repeatedly merge pairs of lists until one remains. After \`log k\` rounds you've merged everything. Each round processes each node once → O(N log k) total. Way better than naively merging all into one which would be O(N · k).`,
      code: {
        javascript: `function mergeKLists(lists) {
  if (!lists || lists.length === 0) return null;
  const mergeTwo = (a, b) => {
    const dummy = new ListNode();
    let tail = dummy;
    while (a && b) {
      if (a.val <= b.val) { tail.next = a; a = a.next; }
      else { tail.next = b; b = b.next; }
      tail = tail.next;
    }
    tail.next = a || b;
    return dummy.next;
  };
  while (lists.length > 1) {
    const merged = [];
    for (let i = 0; i < lists.length; i += 2) {
      merged.push(mergeTwo(lists[i], lists[i + 1] || null));
    }
    lists = merged;
  }
  return lists[0];
}`,
        python: `def merge_k_lists(lists):
    if not lists:
        return None
    def merge_two(a, b):
        dummy = ListNode()
        tail = dummy
        while a and b:
            if a.val <= b.val:
                tail.next = a
                a = a.next
            else:
                tail.next = b
                b = b.next
            tail = tail.next
        tail.next = a if a else b
        return dummy.next
    while len(lists) > 1:
        merged = []
        for i in range(0, len(lists), 2):
            merged.append(merge_two(lists[i], lists[i + 1] if i + 1 < len(lists) else None))
        lists = merged
    return lists[0]`,
        typescript: `function mergeKLists(lists: any[]): any {
  if (!lists || lists.length === 0) return null;
  const LN = (globalThis as any).ListNode;
  const mergeTwo = (a: any, b: any): any => {
    const dummy = new LN();
    let tail = dummy;
    while (a && b) {
      if (a.val <= b.val) { tail.next = a; a = a.next; }
      else { tail.next = b; b = b.next; }
      tail = tail.next;
    }
    tail.next = a || b;
    return dummy.next;
  };
  while (lists.length > 1) {
    const merged: any[] = [];
    for (let i = 0; i < lists.length; i += 2) {
      merged.push(mergeTwo(lists[i], lists[i + 1] || null));
    }
    lists = merged;
  }
  return lists[0];
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/',
  neetcodeUrl: 'https://neetcode.io/problems/merge-k-sorted-linked-lists',
};
