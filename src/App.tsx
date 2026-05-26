import { AlertTriangle } from 'lucide-react';
import { isSupabaseConfigured } from './lib/supabase';
import { useIsMobile } from './lib/useIsMobile';
import AuthGate from './auth/AuthGate';
import AppShell from './views/AppShell';
import MobileSplashView from './views/MobileSplashView';

function ConfigMissing() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <div className="w-full max-w-xl rounded-lg border border-amber-200 bg-white p-6 shadow-sm dark:border-amber-900/40 dark:bg-slate-900">
        <div className="mb-3 flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <AlertTriangle size={20} />
          <span className="font-semibold">Supabase not configured</span>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          The app needs <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800 dark:text-slate-200">VITE_SUPABASE_URL</code>{' '}
          and <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800 dark:text-slate-200">VITE_SUPABASE_ANON_KEY</code>{' '}
          to be set in <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800 dark:text-slate-200">.env</code>.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            Create a Supabase project at{' '}
            <a className="text-indigo-600 hover:underline" href="https://supabase.com" target="_blank" rel="noreferrer">
              supabase.com
            </a>
            .
          </li>
          <li>
            Copy <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800 dark:text-slate-200">.env.example</code> to{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800 dark:text-slate-200">.env</code> and fill in your project's URL and anon key.
          </li>
          <li>
            Run the SQL files in <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800 dark:text-slate-200">supabase/migrations/</code> in the Supabase SQL editor (in order).
          </li>
          <li>
            See <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-slate-800 dark:text-slate-200">SUPABASE_SETUP.md</code> for full step-by-step instructions, including Google OAuth.
          </li>
          <li>Restart the dev server.</li>
        </ol>
      </div>
    </div>
  );
}

export default function App() {
  const isMobile = useIsMobile();

  if (!isSupabaseConfigured) return <ConfigMissing />;
  if (isMobile) return <MobileSplashView />;

  return (
    <AuthGate>
      <AppShell />
    </AuthGate>
  );
}
