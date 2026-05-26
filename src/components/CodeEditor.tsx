import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import CodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import type { Extension } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { selectAll, indentSelection, indentMore, indentLess } from '@codemirror/commands';
import type { Language } from '../types';
import { formatCode } from '../lib/format';

type Props = {
  value: string;
  onChange: (value: string) => void;
  language: Language;
};

export type CodeEditorHandle = {
  /** Async format. JS/TS run through Prettier; Python falls back to indent-only. */
  format: () => Promise<void>;
};

function languageExtension(lang: Language): Extension {
  if (lang === 'python') return python();
  if (lang === 'typescript') return javascript({ typescript: true });
  return javascript();
}

const fillHeightTheme = EditorView.theme({
  '&': { height: '100%', fontSize: '13px' },
  '.cm-scroller': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
  '.cm-content': { padding: '10px 0' },
  '.cm-gutters': { backgroundColor: '#0b1224', borderRight: '1px solid rgba(148, 163, 184, 0.15)' },
  '&.cm-focused': { outline: 'none' },
});

/** Lightweight indent-only fallback for Python (or on Prettier error). */
function reindentOnly(view: EditorView): void {
  selectAll(view);
  indentSelection(view);
  view.dispatch({ selection: { anchor: view.state.selection.main.from } });
}

/** Replace the entire document with new content, preserving cursor at the top. */
function replaceAll(view: EditorView, next: string): void {
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: next },
    selection: { anchor: 0 },
  });
}

const CodeEditor = forwardRef<CodeEditorHandle, Props>(function CodeEditor(
  { value, onChange, language },
  ref
) {
  const cmRef = useRef<ReactCodeMirrorRef | null>(null);

  const doFormat = async (): Promise<void> => {
    const view = cmRef.current?.view;
    if (!view) return;
    const current = view.state.doc.toString();
    const result = await formatCode(current, language);
    if (result.ok) {
      // Only replace if the formatted output actually differs — avoids a no-op
      // history entry and a cursor jump on already-formatted code.
      if (result.formatted !== current) replaceAll(view, result.formatted);
    } else {
      // Unsupported (Python) or syntax error → fall back to indent-only.
      reindentOnly(view);
    }
  };

  // Inside the editor: Cmd+Shift+F triggers format. We need a synchronous
  // wrapper because CodeMirror's keymap expects a sync `run` returning boolean.
  const formatKeymap = useMemo(
    () =>
      keymap.of([
        {
          key: 'Mod-Shift-f',
          preventDefault: true,
          run: () => {
            void doFormat();
            return true;
          },
        },
        { key: 'Tab', run: indentMore },
        { key: 'Shift-Tab', run: indentLess },
      ]),
    // doFormat is recreated each render; the keymap captures the latest via closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const extensions = useMemo<Extension[]>(
    () => [languageExtension(language), fillHeightTheme, formatKeymap],
    [language, formatKeymap]
  );

  useImperativeHandle(
    ref,
    () => ({
      format: doFormat,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="h-full w-full overflow-hidden rounded-md border border-slate-700 bg-[#282c34]">
      <CodeMirror
        ref={cmRef}
        value={value}
        onChange={onChange}
        extensions={extensions}
        theme={oneDark}
        height="100%"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          highlightSelectionMatches: true,
          foldGutter: false,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          history: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          rectangularSelection: true,
          tabSize: 2,
        }}
      />
    </div>
  );
});

export default CodeEditor;
