import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import type { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import type { Language } from '../types';

type Props = {
  value: string;
  onChange: (value: string) => void;
  language: Language;
};

function languageExtension(lang: Language): Extension {
  if (lang === 'python') return python();
  if (lang === 'typescript') return javascript({ typescript: true });
  return javascript();
}

// Make the editor fill its parent (the wrapping <div> in ProblemView is h-full).
const fillHeightTheme = EditorView.theme({
  '&': { height: '100%', fontSize: '13px' },
  '.cm-scroller': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
  '.cm-content': { padding: '10px 0' },
  '.cm-gutters': { backgroundColor: '#0b1224', borderRight: '1px solid rgba(148, 163, 184, 0.15)' },
  '&.cm-focused': { outline: 'none' },
});

export default function CodeEditor({ value, onChange, language }: Props) {
  const extensions = useMemo<Extension[]>(
    () => [languageExtension(language), fillHeightTheme],
    [language]
  );

  return (
    <div className="h-full w-full overflow-hidden rounded-md border border-slate-700 bg-[#282c34]">
      <CodeMirror
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
}
