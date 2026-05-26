import { useState } from 'react';
import { Sparkles, RotateCcw, Code2, AlertTriangle, Loader2 } from 'lucide-react';
import LeetDeckLogo from '../components/LeetDeckLogo';
import { useSession } from '../auth/useSession';

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.5-5.9 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.6 5.8 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.6 6.8 29.6 5 24 5 16.3 5 9.7 9.3 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.5 0 10.4-1.9 14.1-5l-6.5-5.5C29.6 35 26.9 36 24 36c-5.4 0-9.7-3.4-11.3-8L6.1 33C9.4 39.5 16.1 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4 5.3l6.5 5.5C42 33.5 44 28.8 44 24c0-1.2-.1-2.3-.4-3.5z"
    />
  </svg>
);

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0 rounded-md bg-indigo-50 p-1.5 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</div>
        <div className="text-sm text-slate-600 dark:text-slate-400">{body}</div>
      </div>
    </div>
  );
}

export default function LandingView() {
  const { signInWithGoogle } = useSession();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setSigningIn(true);
    setError(null);
    const { error: err } = await signInWithGoogle();
    if (err) {
      setError(err.message);
      setSigningIn(false);
    }
    // On success, the browser is redirected to Google — no further state to set.
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-indigo-50 px-6 py-12 dark:from-slate-950 dark:to-slate-900">
      <div className="grid w-full max-w-4xl gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <LeetDeckLogo size={26} withWordmark />

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            LeetCode patterns
            <br />
            that actually stick.
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400">
            A handful of new problems and reviews each day, scheduled with
            spaced repetition. Anki for algorithms.
          </p>

          <div className="space-y-4 pt-2">
            <Feature
              icon={<Sparkles size={16} />}
              title="Small daily dose"
              body="2–3 new problems and a few reviews each day. Built for consistency, not cramming."
            />
            <Feature
              icon={<RotateCcw size={16} />}
              title="Spaced repetition"
              body="Rate your recall after each problem. We schedule the next review at the right interval."
            />
            <Feature
              icon={<Code2 size={16} />}
              title="In-browser IDE"
              body="Solve in JavaScript, Python, or TypeScript. Tests run instantly."
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Get started</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sign in with Google to save your progress across devices.
            </p>
          </div>

          <button
            onClick={handleSignIn}
            disabled={signingIn}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {signingIn ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {signingIn ? 'Redirecting…' : 'Continue with Google'}
          </button>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-md bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <div>{error}</div>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Free during beta. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}
