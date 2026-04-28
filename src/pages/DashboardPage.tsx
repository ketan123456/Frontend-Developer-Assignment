import { Link } from 'react-router-dom';
import { patients } from '../data/patients';
import { requestNotificationPermission, triggerLocalNotification } from '../lib/notifications';
import { useAppStore } from '../store/app-store';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Panel } from '../components/ui/Panel';
import { StatCard } from '../components/ui/StatCard';

const dashboardStats = [
  { label: 'Active patients', value: '184', delta: '+12 vs yesterday' },
  { label: 'Pending handoffs', value: '17', delta: '5 require same-day action' },
  { label: 'Escalations open', value: '06', delta: '-2 from morning round' },
  { label: 'Staff utilization', value: '81%', delta: 'Target band 76-84%' },
];

const workstreams = [
  { label: 'Admissions triage', owner: 'Bed management', eta: 'Next sweep in 18m', tone: 'warning' as const },
  { label: 'Rehab discharge block', owner: 'Case management', eta: '4 patients waiting', tone: 'critical' as const },
  { label: 'Medication reconciliation', owner: 'Pharmacy', eta: 'On track', tone: 'positive' as const },
];

const getNotificationGuidance = (permission: NotificationPermission | 'unsupported') => {
  switch (permission) {
    case 'granted':
      return {
        tone: 'positive' as const,
        title: 'Notifications are enabled',
        detail:
          'Use the test notification button here or the hero action above. Alerts will appear both in this panel and as browser notifications.',
      };
    case 'denied':
      return {
        tone: 'critical' as const,
        title: 'Browser notifications are blocked',
        detail:
          'This UI is wired, but your browser has denied permission for this site. Re-enable notifications for 127.0.0.1:5174, reload, then send a test alert.',
      };
    case 'unsupported':
      return {
        tone: 'warning' as const,
        title: 'Notifications are not supported here',
        detail:
          'The activity feed still logs alert attempts, but the browser runtime cannot show system notifications in this environment.',
      };
    default:
      return {
        tone: 'warning' as const,
        title: 'Notifications need permission',
        detail:
          'Click the test notification action to trigger the browser permission prompt, then send a patient alert from the dashboard.',
      };
  }
};

export const DashboardPage = () => {
  const user = useAppStore((state) => state.user);
  const notifications = useAppStore((state) => state.notifications);
  const notificationPermission = useAppStore((state) => state.notificationPermission);
  const setNotificationPermission = useAppStore((state) => state.setNotificationPermission);
  const addNotificationRecord = useAppStore((state) => state.addNotificationRecord);

  const featuredPatient = patients[2];
  const notificationGuidance = getNotificationGuidance(notificationPermission);

  const handleDispatchAlert = async () => {
    const permission =
      notificationPermission === 'granted'
        ? 'granted'
        : await requestNotificationPermission();

    setNotificationPermission(permission);

    if (permission !== 'granted') {
      addNotificationRecord({
        id: crypto.randomUUID(),
        title: 'Notification permission needed',
        detail: 'Local alert was not sent because the browser permission was not granted.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        destination: '/dashboard',
      });
      return;
    }

    await triggerLocalNotification({
      title: `Escalation: ${featuredPatient.name}`,
      body: 'Respiratory reassessment due in 10 minutes. Open the patient record to complete the handoff.',
      tag: `patient-${featuredPatient.id}`,
      url: `/patients/${featuredPatient.id}`,
    });

    addNotificationRecord({
      id: crypto.randomUUID(),
      title: `Care alert sent for ${featuredPatient.name}`,
      detail: 'Service worker notification dispatched to the active care operations workspace.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      destination: `/patients/${featuredPatient.id}`,
    });
  };

  return (
    <div className="page-stack">
      <section className="hero-banner">
        <div className="hero-copy">
          <p className="page-eyebrow">Shift summary</p>
          <h2>Welcome back, {user?.name?.split(' ')[0] ?? 'Jordan'}.</h2>
          <p>
            Cardiology and respiratory units are carrying the highest operational pressure right now.
            Two care-transition blocks need same-day action before discharge windows start to slip.
          </p>
        </div>

        <div className="hero-actions">
          <Button onClick={() => void handleDispatchAlert()}>Send test notification</Button>
          <Link className="button button--secondary" to={`/patients/${featuredPatient.id}`}>
            Review escalated patient
          </Link>
        </div>
      </section>

      <div className="stat-grid">
        {dashboardStats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="dashboard-grid">
        <Panel
          title="Operational queue"
          subtitle="High-signal workflows that need attention across the day."
        >
          <div className="workstream-grid">
            {workstreams.map((stream) => (
              <article className="workstream-card" key={stream.label}>
                <div className="workstream-head">
                  <strong>{stream.label}</strong>
                  <Badge tone={stream.tone}>{stream.eta}</Badge>
                </div>
                <p>{stream.owner}</p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel
          title="Notifications"
          subtitle="This is the notification area in the UI. It logs alert activity and triggers the browser notification flow."
          action={<Badge tone={notificationGuidance.tone}>{notificationPermission}</Badge>}
        >
          <div className="notification-helper">
            <div>
              <strong>{notificationGuidance.title}</strong>
              <p>{notificationGuidance.detail}</p>
            </div>
            <div className="panel-actions-row">
              <Button variant="secondary" onClick={() => void handleDispatchAlert()}>
                Send test notification
              </Button>
            </div>
          </div>

          <div className="activity-list">
            {notifications.length ? (
              notifications.map((item) => (
                <Link key={item.id} to={item.destination} className="activity-item">
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </div>
                  <span>{item.timestamp}</span>
                </Link>
              ))
            ) : (
              <div className="empty-note">
                <strong>No notifications yet.</strong>
                <p>Use the notification panel button or the hero action above to send a test alert.</p>
              </div>
            )}
          </div>
        </Panel>

        <Panel title="Team focus" subtitle="Current cross-functional care tasks by unit.">
          <div className="activity-list">
            <div className="activity-item static">
              <div>
                <strong>Case management</strong>
                <p>4 discharge authorizations pending external rehab approval.</p>
              </div>
              <span>Action</span>
            </div>
            <div className="activity-item static">
              <div>
                <strong>Respiratory therapy</strong>
                <p>2 reassessments are within the next 30 minutes.</p>
              </div>
              <span>Critical</span>
            </div>
            <div className="activity-item static">
              <div>
                <strong>Pharmacy</strong>
                <p>Medication reconciliation backlog dropped below target threshold.</p>
              </div>
              <span>Healthy</span>
            </div>
          </div>
        </Panel>

        <Panel title="Featured patient" subtitle="Fast path to the highest-priority chart in the system.">
          <article className="featured-patient-card">
            <div>
              <p className="page-eyebrow">Escalated case</p>
              <h3>{featuredPatient.name}</h3>
              <p>{featuredPatient.primaryCondition}</p>
            </div>
            <div className="chip-row">
              <Badge tone="critical">{featuredPatient.riskLevel} risk</Badge>
              <Badge tone="warning">{featuredPatient.status}</Badge>
            </div>
            <p className="featured-summary">{featuredPatient.carePlanSummary}</p>
            <Link className="inline-link" to={`/patients/${featuredPatient.id}`}>
              Open patient details
            </Link>
          </article>
        </Panel>
      </div>
    </div>
  );
};
