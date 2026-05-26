import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useSession } from './useSession';
import LandingView from '../views/LandingView';

export default function AuthGate({ children }: { children: ReactNode }) {
  const { loading, user } = useSession();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 size={20} className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (!user) return <LandingView />;

  return <>{children}</>;
}
