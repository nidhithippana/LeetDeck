import type { Problem } from '../types';

// Arrays & Hashing
import { twoSum } from './problems/two-sum';
import { containsDuplicate } from './problems/contains-duplicate';
import { validAnagram } from './problems/valid-anagram';
import { productExceptSelf } from './problems/product-except-self';
import { groupAnagrams } from './problems/group-anagrams';
import { topKFrequent } from './problems/top-k-frequent';
import { longestConsecutiveSequence } from './problems/longest-consecutive-sequence';

// Two Pointers
import { validPalindrome } from './problems/valid-palindrome';
import { containerWithMostWater } from './problems/container-with-most-water';
import { threeSum } from './problems/three-sum';

// Sliding Window
import { bestTimeStock } from './problems/best-time-stock';
import { longestSubstringNoRepeat } from './problems/longest-substring-no-repeat';
import { characterReplacement } from './problems/character-replacement';

// Stack
import { validParentheses } from './problems/valid-parentheses';

// Binary Search
import { binarySearch } from './problems/binary-search';
import { searchRotated } from './problems/search-rotated';
import { findMinRotated } from './problems/find-min-rotated';

// Bit Manipulation
import { sumTwoIntegers } from './problems/sum-two-integers';
import { numberOfOneBits } from './problems/number-of-1-bits';
import { missingNumber } from './problems/missing-number';
import { reverseBits } from './problems/reverse-bits';

// Dynamic Programming
import { climbingStairs } from './problems/climbing-stairs';
import { maximumSubarray } from './problems/maximum-subarray';
import { countingBits } from './problems/counting-bits';
import { houseRobber } from './problems/house-robber';
import { coinChange } from './problems/coin-change';
import { wordBreak } from './problems/word-break';
import { houseRobberII } from './problems/house-robber-ii';
import { jumpGame } from './problems/jump-game';
import { uniquePaths } from './problems/unique-paths';
import { maxProductSubarray } from './problems/max-product-subarray';

// Intervals
import { insertInterval } from './problems/insert-interval';
import { mergeIntervals } from './problems/merge-intervals';

// Strings
import { longestPalindromicSubstring } from './problems/longest-palindromic-substring';

// Trees
import { maxDepthBinaryTree } from './problems/max-depth-binary-tree';
import { sameTree } from './problems/same-tree';
import { invertBinaryTree } from './problems/invert-binary-tree';
import { subtreeOfAnother } from './problems/subtree-of-another';
import { levelOrderTraversal } from './problems/level-order-traversal';
import { validateBst } from './problems/validate-bst';
import { kthSmallestBst } from './problems/kth-smallest-bst';

// Linked List
import { reverseLinkedList } from './problems/reverse-linked-list';
import { mergeTwoSortedLists } from './problems/merge-two-sorted-lists';
import { linkedListCycle } from './problems/linked-list-cycle';
import { removeNthFromEnd } from './problems/remove-nth-from-end';
import { reorderList } from './problems/reorder-list';

// Graphs
import { numberOfIslands } from './problems/number-of-islands';
import { cloneGraph } from './problems/clone-graph';
import { courseSchedule } from './problems/course-schedule';
import { pacificAtlantic } from './problems/pacific-atlantic';

// Matrix
import { setMatrixZeroes } from './problems/set-matrix-zeroes';
import { spiralMatrix } from './problems/spiral-matrix';
import { rotateImage } from './problems/rotate-image';

// Backtracking
import { wordSearch } from './problems/word-search';
import { combinationSum } from './problems/combination-sum';

// More DP + Strings (Batch 7)
import { longestIncreasingSubsequence } from './problems/longest-increasing-subsequence';
import { decodeWays } from './problems/decode-ways';
import { palindromicSubstrings } from './problems/palindromic-substrings';

// Batch 8 — final push
import { longestCommonSubsequence } from './problems/longest-common-subsequence';
import { maxPathSum } from './problems/max-path-sum';
import { constructTree } from './problems/construct-tree';
import { lcaBst } from './problems/lca-bst';
import { nonOverlappingIntervals } from './problems/non-overlapping-intervals';
import { meetingRooms } from './problems/meeting-rooms';
import { meetingRoomsII } from './problems/meeting-rooms-ii';
import { graphValidTree } from './problems/graph-valid-tree';
import { connectedComponents } from './problems/connected-components';
import { minimumWindowSubstring } from './problems/minimum-window-substring';
import { implementTrie } from './problems/implement-trie';
import { addSearchWord } from './problems/add-search-word';
import { findMedianStream } from './problems/find-median-stream';

// Batch 9 — final 5
import { mergeKSortedLists } from './problems/merge-k-sorted-lists';
import { encodeDecodeStrings } from './problems/encode-decode-strings';
import { serializeDeserializeTree } from './problems/serialize-deserialize-tree';
import { wordSearchII } from './problems/word-search-ii';
import { alienDictionary } from './problems/alien-dictionary';

export const PROBLEMS: Problem[] = [
  twoSum,
  containsDuplicate,
  validAnagram,
  productExceptSelf,
  validPalindrome,
  validParentheses,
  bestTimeStock,
  binarySearch,
  climbingStairs,
  maximumSubarray,
  groupAnagrams,
  topKFrequent,
  longestConsecutiveSequence,
  containerWithMostWater,
  threeSum,
  longestSubstringNoRepeat,
  characterReplacement,
  searchRotated,
  sumTwoIntegers,
  numberOfOneBits,
  countingBits,
  missingNumber,
  reverseBits,
  houseRobber,
  coinChange,
  wordBreak,
  houseRobberII,
  jumpGame,
  uniquePaths,
  maxProductSubarray,
  findMinRotated,
  insertInterval,
  mergeIntervals,
  longestPalindromicSubstring,
  maxDepthBinaryTree,
  sameTree,
  invertBinaryTree,
  subtreeOfAnother,
  levelOrderTraversal,
  validateBst,
  kthSmallestBst,
  reverseLinkedList,
  mergeTwoSortedLists,
  linkedListCycle,
  removeNthFromEnd,
  reorderList,
  numberOfIslands,
  cloneGraph,
  courseSchedule,
  pacificAtlantic,
  setMatrixZeroes,
  spiralMatrix,
  rotateImage,
  wordSearch,
  combinationSum,
  longestIncreasingSubsequence,
  decodeWays,
  palindromicSubstrings,
  longestCommonSubsequence,
  maxPathSum,
  constructTree,
  lcaBst,
  nonOverlappingIntervals,
  meetingRooms,
  meetingRoomsII,
  graphValidTree,
  connectedComponents,
  minimumWindowSubstring,
  implementTrie,
  addSearchWord,
  findMedianStream,
  mergeKSortedLists,
  encodeDecodeStrings,
  serializeDeserializeTree,
  wordSearchII,
  alienDictionary,
];

export const PROBLEMS_BY_ID: Record<string, Problem> = Object.fromEntries(
  PROBLEMS.map((p) => [p.id, p])
);
