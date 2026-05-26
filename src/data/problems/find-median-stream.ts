import type { Problem } from '../../types';

export const findMedianStream: Problem = {
  id: 'find-median-stream',
  title: 'Find Median from Data Stream',
  difficulty: 'Hard',
  topic: 'Heap / Priority Queue',
  order: 71,

  prompt: `Design a data structure that supports adding integers from a data stream and finding the **median** of all elements so far.

- \`MedianFinder()\` — initialize.
- \`addNum(num)\` — add \`num\` to the data structure.
- \`findMedian()\` — return the median (average of two middles if count is even).`,

  examples: [
    {
      input: 'MedianFinder · addNum(1) · addNum(2) · findMedian · addNum(3) · findMedian',
      output: 'null · null · null · 1.5 · null · 2.0',
    },
  ],

  constraints: ['-10^5 <= num <= 10^5', 'There will be at least one element before findMedian.', 'At most 5 * 10^4 calls.'],

  languages: {
    javascript: {
      functionName: 'MedianFinder',
      starterCode: `class MedianFinder {
  constructor() {

  }
  addNum(num) {

  }
  findMedian() {

  }
}`,
    },
    python: {
      functionName: 'MedianFinder',
      starterCode: `class MedianFinder:
    def __init__(self):
        pass

    def addNum(self, num):
        pass

    def findMedian(self):
        pass`,
    },
    typescript: {
      functionName: 'MedianFinder',
      starterCode: `class MedianFinder {
  constructor() {

  }
  addNum(num: number): void {

  }
  findMedian(): number {
    return 0;
  }
}`,
    },
  },

  isClassDesign: true,
  tests: [],
  classTests: [
    {
      ops: ['MedianFinder', 'addNum', 'addNum', 'findMedian', 'addNum', 'findMedian'],
      args: [[], [1], [2], [], [3], []],
      expected: [null, null, null, 1.5, null, 2.0],
    },
    {
      ops: ['MedianFinder', 'addNum', 'findMedian'],
      args: [[], [5], []],
      expected: [null, null, 5.0],
    },
  ],

  solutions: [
    {
      name: 'Two Heaps (Max-Left, Min-Right)',
      timeComplexity: 'O(log n) addNum, O(1) findMedian',
      spaceComplexity: 'O(n)',
      explanation: `Split the numbers into two halves:
- A **max-heap** \`small\` holds the smaller half.
- A **min-heap** \`large\` holds the larger half.

Keep them balanced so \`small\` has either the same size or one more element. The median is either \`small.top()\` (odd total) or the average of both tops (even).

JavaScript has no built-in heap — we implement a tiny one inline. Python has \`heapq\` (which is a min-heap, so negate for max-heap behavior).`,
      code: {
        javascript: `class MinHeap {
  constructor() { this.a = []; }
  size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(v) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p] <= this.a[i]) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop() {
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let smallest = i;
        if (l < this.a.length && this.a[l] < this.a[smallest]) smallest = l;
        if (r < this.a.length && this.a[r] < this.a[smallest]) smallest = r;
        if (smallest === i) break;
        [this.a[smallest], this.a[i]] = [this.a[i], this.a[smallest]];
        i = smallest;
      }
    }
    return top;
  }
}

class MedianFinder {
  constructor() {
    this.small = new MinHeap(); // stores negated values → acts as max-heap
    this.large = new MinHeap();
  }
  addNum(num) {
    this.small.push(-num);
    this.large.push(-this.small.pop());
    if (this.large.size() > this.small.size()) {
      this.small.push(-this.large.pop());
    }
  }
  findMedian() {
    if (this.small.size() > this.large.size()) return -this.small.peek();
    return (-this.small.peek() + this.large.peek()) / 2;
  }
}`,
        python: `import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # max-heap (negated)
        self.large = []  # min-heap

    def addNum(self, num):
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2`,
        typescript: `class MinHeap {
  a: number[] = [];
  size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(v: number): void {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p] <= this.a[i]) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop(): number {
    const top = this.a[0];
    const last = this.a.pop()!;
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let smallest = i;
        if (l < this.a.length && this.a[l] < this.a[smallest]) smallest = l;
        if (r < this.a.length && this.a[r] < this.a[smallest]) smallest = r;
        if (smallest === i) break;
        [this.a[smallest], this.a[i]] = [this.a[i], this.a[smallest]];
        i = smallest;
      }
    }
    return top;
  }
}

class MedianFinder {
  small = new MinHeap();
  large = new MinHeap();
  addNum(num: number): void {
    this.small.push(-num);
    this.large.push(-this.small.pop());
    if (this.large.size() > this.small.size()) {
      this.small.push(-this.large.pop());
    }
  }
  findMedian(): number {
    if (this.small.size() > this.large.size()) return -this.small.peek();
    return (-this.small.peek() + this.large.peek()) / 2;
  }
}`,
      },
    },
  ],

  leetcodeUrl: 'https://leetcode.com/problems/find-median-from-data-stream/',
  neetcodeUrl: 'https://neetcode.io/problems/find-median-in-a-data-stream',
};
