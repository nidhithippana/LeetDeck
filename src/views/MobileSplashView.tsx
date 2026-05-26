import { Monitor } from 'lucide-react';
import LeetDeckLogo from '../components/LeetDeckLogo';

export default function MobileSplashView() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-indigo-50 px-6 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-sm space-y-5 text-center">
        <div className="flex items-center justify-center">
          <LeetDeckLogo size={26} withWordmark />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Monitor size={32} className="mx-auto text-indigo-600 dark:text-indigo-400" />
          <h1 className="mt-3 text-xl font-bold text-slate-900 dark:text-slate-100">
            Best on desktop
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            LeetDeck's split-pane editor needs a wider screen. Open it on a
            laptop or desktop browser — same URL, just a bigger window.
          </p>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
            Mobile support is on the roadmap.
          </p>
        </div>
      </div>
    </div>
  );
}
