import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from '../../store/app-store';
import { AppShell } from '../layout/AppShell';

export const ProtectedRoute = () => {
  const authStatus = useAppStore((state) => state.authStatus);
  const bootstrapSession = useAppStore((state) => state.bootstrapSession);

  useEffect(() => {
    const unsubscribe = bootstrapSession();
    return () => {
      unsubscribe?.();
    };
  }, [bootstrapSession]);

  if (authStatus === 'idle' || authStatus === 'loading') {
    return (
      <div className="app-splash">
        <div className="app-splash-card">
          <span className="pulse-dot" />
          <h2>Restoring care-team session</h2>
          <p>Preparing the patient operations workspace and syncing access state.</p>
        </div>
      </div>
    );
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};
