/**
 * Canonical topic order — matches the NeetCode 150 roadmap progression.
 *
 * Used by:
 *   - BrowseSidebar (render groups in this order, top-to-bottom)
 *   - buildDailyQueue (pick next "new" problems following this curriculum order)
 *
 * Every Problem's `topic` field must match one of these strings exactly.
 */
export const TOPIC_ORDER = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Binary Search',
  'Linked List',
  'Trees',
  'Heap / Priority Queue',
  'Backtracking',
  'Tries',
  'Graphs',
  'Advanced Graphs',
  '1-D Dynamic Programming',
  '2-D Dynamic Programming',
  'Greedy',
  'Intervals',
  'Math & Geometry',
  'Bit Manipulation',
] as const;

export type Topic = (typeof TOPIC_ORDER)[number];

export function topicIndex(topic: string): number {
  const i = (TOPIC_ORDER as readonly string[]).indexOf(topic);
  // Unknown topics sort to the end so they don't break the queue.
  return i === -1 ? TOPIC_ORDER.length : i;
}
