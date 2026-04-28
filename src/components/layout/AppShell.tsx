import type { PropsWithChildren } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/app-store';
import { Button } from '../ui/Button';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', eyebrow: '01' },
  { to: '/analytics', label: 'Analytics', eyebrow: '02' },
  { to: '/patients', label: 'Patient details', eyebrow: '03' },
];

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Operations Command Center',
    subtitle: 'Track admissions, escalations, and care-team actions from one place.',
  },
  '/analytics': {
    title: 'Performance Analytics',
    subtitle: 'Review operational throughput, care response, and team utilization.',
  },
};

export const AppShell = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  const isPatientRoute = location.pathname.startsWith('/patients');
  const meta = isPatientRoute
    ? {
        title: 'Patient Coordination',
        subtitle: 'Review patient status, milestones, and care-transition tasks.',
      }
    : pageMeta[location.pathname];

  return (
    <div className="shell">
      <aside className="shell-sidebar">
        <div className="shell-brand">
          <div className="shell-brand-mark">CA</div>
          <div>
            <p className="shell-brand-title">CareAxis</p>
            <p className="shell-brand-copy">Healthcare operations SaaS</p>
          </div>
        </div>

        <nav className="shell-nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `shell-link ${isActive || (item.to === '/patients' && isPatientRoute) ? 'active' : ''}`
              }
            >
              <span className="shell-link-eyebrow">{item.eyebrow}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="shell-sidebar-footer">
          <p className="shell-sidebar-label">Signed in</p>
          <strong>{user?.name ?? 'Care team member'}</strong>
          <span>{user?.role ?? 'Operator'}</span>
        </div>
      </aside>

      <main className="shell-main">
        <header className="shell-topbar">
          <div className="shell-topbar-copy">
            <p className="page-eyebrow">B2B healthcare SaaS</p>
            <h1>{meta?.title}</h1>
            <p>{meta?.subtitle}</p>
          </div>

          <div className="shell-topbar-actions">
            <div className="shell-user-chip">
              <span>{user?.email}</span>
              <strong>{user?.mode === 'firebase' ? 'Firebase session' : 'Demo session'}</strong>
            </div>
            <Button variant="ghost" onClick={() => void logout()}>
              Sign out
            </Button>
          </div>
        </header>

        <div className="page">{children}</div>
      </main>
    </div>
  );
};
