import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Loader2, PanelLeftOpen } from 'lucide-react';
import TodayView from './TodayView';
import ProblemView from './ProblemView';
import BrowseSidebar from '../components/BrowseSidebar';
import SettingsModal from '../components/SettingsModal';
import { useSession } from '../auth/useSession';
import { useSrsState } from '../srs/useSrsState';
import { updateProfile } from '../srs/storage';
import { PROBLEMS_BY_ID } from '../data/problems';
import type { Rating } from '../types';

type Route =
  | { name: 'today' }
  | { name: 'problem'; problemId: string; kind: 'new' | 'review' | 'practice' };

export default function AppShell() {
  const { user, signOut } = useSession();
  const srs = useSrsState();

  const [route, setRoute] = useState<Route>({ name: 'today' });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('leetdeck.sidebar.collapsed') === 'true';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('leetdeck.sidebar.collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const goToday = useCallback(() => setRoute({ name: 'today' }), []);
  const openProblem = useCallback(
    (problemId: string, kind: 'new' | 'review') =>
      setRoute({ name: 'problem', problemId, kind }),
    []
  );
  const openPractice = useCallback(
    (problemId: string) => setRoute({ name: 'problem', problemId, kind: 'practice' }),
    []
  );
  const openSettings = useCallback(() => setSettingsOpen(true), []);

  if (!user) return null;

  if (srs.loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 size={20} className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (srs.error || !srs.data) {
    return (
      <div className="flex h-screen items-center justify-center px-6">
        <div className="max-w-md rounded-lg border border-rose-200 bg-rose-50 p-5 dark:border-rose-900/40 dark:bg-rose-950/30">
          <div className="flex items-start gap-2 text-rose-800 dark:text-rose-300">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold">Couldn't load your data</div>
              <div className="mt-1 text-sm">{srs.error ?? 'Unknown error'}</div>
              <button
                onClick={() => void srs.refresh()}
                className="mt-3 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeProblemId = route.name === 'problem' ? route.problemId : null;

  const handleSaveSettings = async (updates: {
    newPerDay: number;
    reviewPerDay: number;
    reminderHour: number | null;
    timezone: string | null;
  }) => {
    await updateProfile(updates);
    await srs.refresh();
  };

  let content: React.ReactNode;
  if (route.name === 'today') {
    content = (
      <TodayView
        data={srs.data}
        user={user}
        onOpenProblem={openProblem}
        onSignOut={signOut}
        onOpenSettings={openSettings}
      />
    );
  } else {
    const problem = PROBLEMS_BY_ID[route.problemId];
    if (!problem) {
      goToday();
      return null;
    }
    const handleRate = async (rating: Rating) => {
      if (route.kind === 'practice') return;
      await srs.rateProblem(problem.id, rating, route.kind);
      goToday();
    };
    const handleMark = async (rating: Rating) => {
      await srs.markCard(problem.id, rating);
    };
    content = (
      <ProblemView
        problem={problem}
        kind={route.kind}
        card={srs.data.cards[problem.id]}
        user={user}
        onBack={goToday}
        onRate={handleRate}
        onMark={handleMark}
        onSignOut={signOut}
        onOpenSettings={openSettings}
      />
    );
  }

  return (
    <div className="flex h-screen">
      {sidebarCollapsed ? (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="flex w-7 shrink-0 items-center justify-center border-r border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-300"
          aria-label="Expand sidebar"
          title="Expand sidebar"
        >
          <PanelLeftOpen size={14} />
        </button>
      ) : (
        <BrowseSidebar
          data={srs.data}
          activeProblemId={activeProblemId}
          onOpenProblem={openPractice}
          onGoHome={goToday}
          onCollapse={() => setSidebarCollapsed(true)}
        />
      )}
      <div className="min-w-0 flex-1">{content}</div>

      <SettingsModal
        open={settingsOpen}
        profile={srs.data.profile}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
