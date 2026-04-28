import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from '../../store/app-store';

export const PublicOnlyRoute = ({ children }: PropsWithChildren) => {
  const authStatus = useAppStore((state) => state.authStatus);
  const bootstrapSession = useAppStore((state) => state.bootstrapSession);

  useEffect(() => {
    const unsubscribe = bootstrapSession();
    return () => {
      unsubscribe?.();
    };
  }, [bootstrapSession]);

  if (authStatus === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
