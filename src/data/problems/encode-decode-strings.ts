import type { Problem } from '../../types';

export const encodeDecodeStrings: Problem = {
  id: 'encode-decode-strings',
  title: 'Encode and Decode Strings',
  difficulty: 'Medium',
  topic: 'Arrays & Hashing',
  order: 73,

  prompt: `Design an algorithm to **encode** a list of strings to a single string, and **decode** a single string back to the original list of strings.

Implement a class \`Codec\` with two methods:
- \`encode(strs)\` → returns a single encoded string.
- \`decode(s)\` → given an encoded string, returns the original list of strings.

The strings may contain **any** UTF-8 characters, including delimiters you might want to use.`,

  examples: [
    { input: 'strs = ["lint","code","love","you"]', output: '["lint","code","love","you"]', explanation: 'Encode → some string → decode back.' },
    { input: 'strs = [""]', output: '[""]' },
    { input: 'strs = []', output: '[]' },
  ],

  constraints: ['1 <= strs.length <= 200', '0 <= strs[i].length <= 200'],

  languages: {
    javascript: {
      functionName: 'Codec',
      starterCode: `class Codec {
  encode(strs) {

  }
  decode(s) {

  }
}`,
    },
    python: {
      functionName: 'Codec',
      starterCode: `class Codec:
    def encode(self, strs):
        pass

    def decode(self, s):
        pass`,
    },
    typescript: {
      functionName: 'Codec',
      starterCode: `class Codec {
  encode(strs: string[]): string {
    return '';
  }
  decode(s: string): string[] {
    return [];
  }
}`,
    },
  },

  isClassDesign: true,
  tests: [],
  // Round-trip tests: encode then decode, verify the original is recovered.
  classTests: [
    {
      ops: ['Codec', 'encode', 'decode'],
      args: [[], [['lint', 'code', 'love', 'you']], ['__USE_PREV__']],
      expected: [null, '__SKIP__', ['lint', 'code', 'love', 'you']],
    },
    {
      ops: ['Codec', 'encode', 'decode'],
      args: [[], [['']], ['__USE_PREV__']],
      expected: [null, '__SKIP__', ['']],
    },
    {
      ops: ['Codec', 'encode', 'decode'],
      args: [[], [['hello', 'world']], ['__USE_PREV__']],
      expected: [null, '__SKIP__', ['hello', 'world']],
    },
    {
      ops: ['Codec', 'encode', 'decode'],
      args: [[], [['#5#hello', 'world']], ['__USE_PREV__']],
      expected: [null, '__SKIP__', ['#5#hello', 'world']],
    },
  ],

  solutions: [
    {
      name: 'Length-Prefix Encoding',
      timeComplexity: 'O(N) total chars',
      spaceComplexity: 'O(N)',
      explanation: `Encode each string as \`<length>#<string>\`. The delimiter \`#\` is fine because lengths are numeric — when decoding, find the \`#\`, read the length, then read exactly that many characters. This works even if the strings contain \`#\` themselves.

This is the standard interview-acceptable answer. Avoid relying on a "rare" delimiter character because the input might still contain it.`,
      code: {
        javascript: `class Codec {
  encode(strs) {
    return strs.map(s => s.length + '#' + s).join('');
  }
  decode(s) {
    const result = [];
    let i = 0;
    while (i < s.length) {
      const j = s.indexOf('#', i);
      const len = parseInt(s.slice(i, j), 10);
      result.push(s.slice(j + 1, j + 1 + len));
      i = j + 1 + len;
    }
    return result;
  }
}`,
        python: `class Codec:
    def encode(self, strs):
        return ''.join(f"{len(s)}#{s}" for s in strs)

    def decode(self, s):
        result = []
        i = 0
        while i < len(s):
            j = s.index('#', i)
            length = int(s[i:j])
            result.append(s[j + 1:j + 1 + length])
            i = j + 1 + length
        return result`,
        typescript: `class Codec {
  encode(strs: string[]): string {
    return strs.map(s => s.length + '#' + s).join('');
  }
  decode(s: string): string[] {
    const result: string[] = [];
    let i = 0;
    while (i < s.length) {
      const j = s.indexOf('#', i);
      const len = parseInt(s.slice(i, j), 10);
      result.push(s.slice(j + 1, j + 1 + len));
      i = j + 1 + len;
    }
    return result;
  }
}`,
      },
    },
  ],

  // Custom round-trip tests need special runner support.
  // We use a special expected pattern: __SKIP__ means "don't check this result"
  // and __USE_PREV__ as the arg means "feed previous result as input".
  // The runner doesn't natively support this — the test will appear to "pass"
  // when the entire sequence round-trips correctly via decode comparing to the
  // input we expected.

  leetcodeUrl: 'https://leetcode.com/problems/encode-and-decode-strings/',
  neetcodeUrl: 'https://neetcode.io/problems/string-encode-and-decode',
};
