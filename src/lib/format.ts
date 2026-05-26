import type { Language } from '../types';

/**
 * Format code using Prettier (for JS/TS) — lazy-loaded so the ~300KB Prettier
 * bundle only ships when the user actually clicks Format.
 *
 * Returns:
 *   - { ok: true, formatted } on success
 *   - { ok: false, reason: 'unsupported' } for Python (Prettier has no
 *     officially-maintained Python plugin; caller should fall back to
 *     CodeMirror's `indentSelection`)
 *   - { ok: false, reason: 'error', error } for syntax errors etc.
 *
 * Settings are chosen to match the starter code style:
 *   - 2-space indent
 *   - single quotes
 *   - semicolons on
 *   - 80 column wrap
 */
export type FormatResult =
  | { ok: true; formatted: string }
  | { ok: false; reason: 'unsupported' }
  | { ok: false; reason: 'error'; error: string };

export async function formatCode(code: string, language: Language): Promise<FormatResult> {
  if (language === 'python') return { ok: false, reason: 'unsupported' };

  try {
    // Dynamic imports — these become a separate chunk that only loads on first format.
    const [{ format }, babelPlugin, estreePlugin, tsPlugin] = await Promise.all([
      import('prettier/standalone'),
      import('prettier/plugins/babel'),
      import('prettier/plugins/estree'),
      import('prettier/plugins/typescript'),
    ]);

    const formatted = await format(code, {
      parser: language === 'typescript' ? 'typescript' : 'babel',
      plugins: [babelPlugin.default, estreePlugin.default, tsPlugin.default],
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      printWidth: 80,
      trailingComma: 'es5',
    });

    return { ok: true, formatted };
  } catch (err) {
    return {
      ok: false,
      reason: 'error',
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
