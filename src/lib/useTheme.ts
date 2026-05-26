import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'leetdeck.theme';

function readInitial(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Reactive theme state. Adds/removes `dark` on <html> and persists choice
 * to localStorage. The actual color switching is handled by Tailwind
 * `dark:` classes throughout the app.
 *
 * The first render of the app already has the correct class on <html>
 * because index.html runs an inline script before React mounts.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => readInitial());

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return {
    theme,
    setTheme: (t: Theme) => setThemeState(t),
    toggle: () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')),
  };
}
