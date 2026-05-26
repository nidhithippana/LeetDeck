import type { Problem } from '../../types';

export const mergeTwoSortedLists: Problem = {
  id: 'merge-two-sorted-lists',
  title: 'Merge Two Sorted Lists',
  difficulty: 'Easy',
  topic: 'Linked List',
  order: 43,

  prompt: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.`,

  examples: [
    { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
    { input: 'list1 = [], list2 = []', output: '[]' },
    { input: 'list1 = [], list2 = [0]', output: '[0]' },
  ],

  constraints: ['Both lists are sorted in non-decreasing order.', '0 <= length <= 50'],

  languages: {
    javascript: {
      functionName: 'mergeTwoLists',
      starterCode: `function mergeTwoLists(list1, list2) {

}`,
    },
    python: {
      functionName: 'merge_two_lists',
      starterCode: `def merge_two_lists(list1, list2):
    pass`,
    },
    typescript: {
      functionName: 'mergeTwoLists',
      starterCode: `function mergeTwoLists(list1: any, list2: any): any {
  return null;
}`,
    },
  },

  inputKinds: ['list', 'list'],
  outputKind: 'list',

  tests: [
    { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
    { input: [[], []], expected: [] },
    { input: [[], [0]], expected: [0] },
    { input: [[1, 5], [2, 3, 4]], expected: [1, 2, 3, 4, 5] },
    { input: [[5], [1, 2, 3]], expected: [1, 2, 3, 5] },
  ],

  solutions: [
    {
      name: 'Dummy Head + Two Pointers',
      timeComplexity: 'O(m + n)',
      spaceComplexity: 'O(1)',
      explanation: `Use a dummy head node so you don't have to special-case the empty result. Walk both lists with two pointers, always appending the smaller value to the result tail. When one list runs out, append the rest of the other. Return \`dummy.next\`.`,
      code: {
        javascript: `function mergeTwoLists(list1, list2) {
  const dummy = new ListNode();
  let tail = dummy;
  while (list1 && list2) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }
  tail.next = list1 || list2;
  return dummy.next;
}`,
        python: `def merge_two_lists(list1, list2):
    dummy = ListNode()
    tail = dummy
    while list1 and list2:
        if list1.val <= list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next
    tail.next = list1 or list2
    return dummy.next`,
        typescript: `function mergeTwoLists(list1: any, list2: any): any {
  const dummy: any = new (globalThis as any).ListNode();
  let tail = dummy;
  while (list1 && list2) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }
  tail.next = list1 || list2;
  return dummy.next;
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/',
  neetcodeUrl: 'https://neetcode.io/problems/merge-two-sorted-linked-lists',
};
