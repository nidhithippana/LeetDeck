export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Language = 'javascript' | 'python' | 'typescript';

export const LANGUAGES: Language[] = ['javascript', 'python', 'typescript'];

export const LANGUAGE_LABEL: Record<Language, string> = {
  javascript: 'JavaScript',
  python: 'Python',
  typescript: 'TypeScript',
};

export type Example = {
  input: string;
  output: string;
  explanation?: string;
};

export type TestCase = {
  input: unknown[];
  expected: unknown;
  unordered?: boolean;
};

/**
 * How a value is shaped when handed to the user's function (or returned from it).
 *
 *  - 'primitive' (default): pass/return as-is
 *  - 'tree': test value is a level-order array (with nulls for missing nodes);
 *            the runner converts to a `TreeNode` before calling the user fn,
 *            and converts the returned `TreeNode` back to an array for comparison.
 *  - 'list': test value is an array of node values; converted to/from `ListNode`.
 *  - 'list-with-cycle': test value is `[array, pos]` where `pos` is the index
 *            the tail's `.next` connects back to (or `-1` for no cycle).
 *            Converted to a `ListNode`; not used as an output kind.
 *
 * Output handling: if the user function returns `undefined` and `outputKind`
 * is non-primitive, the runner takes the first input arg (post-transform) as
 * the result — supports LeetCode's "modify in-place" signatures.
 */
export type InputKind = 'primitive' | 'tree' | 'list' | 'list-with-cycle' | 'list-array' | 'graph';

export type LanguageConfig = {
  /** The entry-point function name in this language's starter code. */
  functionName: string;
  /** Starter code shown when the user picks this language. */
  starterCode: string;
};

export type Solution = {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  /** Language-agnostic prose explanation of the approach. */
  explanation: string;
  /** Per-language implementations of this same approach. */
  code: Record<Language, string>;
};

/**
 * For class-based design problems (Trie, MedianFinder, etc.):
 *   ops:       e.g. ['Trie', 'insert', 'search', 'startsWith']
 *   args:      args for each op (first one is constructor args)
 *   expected:  array aligned with ops; constructor returns null; void methods return null
 */
export type ClassTestCase = {
  ops: string[];
  args: unknown[][];
  expected: unknown[];
};

export type Problem = {
  id: string;
  title: string;
  difficulty: Difficulty;
  topic: string;
  order: number;
  prompt: string;
  examples: Example[];
  constraints?: string[];
  /** Per-language entry-point name + starter code. */
  languages: Record<Language, LanguageConfig>;
  tests: TestCase[];
  solutions: Solution[];
  /**
   * Per-positional input kind. Inputs not specified default to 'primitive'.
   * E.g. `['tree', 'primitive']` means input[0] is wrapped as a TreeNode.
   */
  inputKinds?: InputKind[];
  /** Output kind. Defaults to 'primitive'. */
  outputKind?: InputKind;
  /**
   * For class-based problems: the class the user implements. When set, the
   * runner uses `classTests` instead of `tests`, and `functionName` should be
   * the class name in each language.
   */
  isClassDesign?: boolean;
  /** Test cases for class-based problems. Used iff `isClassDesign` is true. */
  classTests?: ClassTestCase[];
  leetcodeUrl?: string;
  neetcodeUrl?: string;
};

export type TestResult = {
  pass: boolean;
  input: unknown[];
  expected: unknown;
  actual: unknown;
  error?: string;
  durationMs: number;
};

export type TestRunResult =
  | { ok: true; results: TestResult[] }
  | { ok: false; error: string };

// ─── SRS ───────────────────────────────────────────────────────────────────

export type Rating = 'again' | 'hard' | 'good' | 'easy';

export type CardState = {
  problemId: string;
  repetitions: number;
  easeFactor: number;
  intervalDays: number;
  /** YYYY-MM-DD */
  dueDate: string;
  /** YYYY-MM-DD or null if never reviewed */
  lastReviewed: string | null;
  totalReviews: number;
  /** Count of "Again" ratings — how often the user has forgotten this problem. */
  lapses: number;
};

export type Profile = {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  newPerDay: number;
  reviewPerDay: number;
  streak: number;
  /** YYYY-MM-DD or null if user has never completed a problem. */
  lastActiveDate: string | null;
  /** Hour of day (0-23, local time) to email the reminder. null = disabled. */
  reminderHour: number | null;
  /** IANA timezone string (e.g. "America/Los_Angeles"). Captured from browser. */
  timezone: string | null;
};

export type SessionLog = {
  /** YYYY-MM-DD */
  sessionDate: string;
  newCompleted: string[];
  reviewCompleted: string[];
};
