import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { patients } from '../data/patients';
import { useAppStore } from '../store/app-store';
import { Badge } from '../components/ui/Badge';
import { Panel } from '../components/ui/Panel';
import { SegmentedControl } from '../components/ui/SegmentedControl';

export const PatientDetailsPage = () => {
  const { patientId } = useParams();
  const patientView = useAppStore((state) => state.patientView);
  const setPatientView = useAppStore((state) => state.setPatientView);
  const setActivePatientId = useAppStore((state) => state.setActivePatientId);

  const patient = patients.find((entry) => entry.id === patientId) ?? patients[0];

  useEffect(() => {
    if (patient?.id) {
      setActivePatientId(patient.id);
    }
  }, [patient?.id, setActivePatientId]);

  if (!patient) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="patient-layout">
      <aside className="patient-directory">
        <div className="patient-directory-head">
          <p className="page-eyebrow">Patient roster</p>
          <h2>Live admissions</h2>
        </div>
        <div className="patient-directory-list">
          {patients.map((entry) => {
            const active = entry.id === patient.id;
            const tone =
              entry.riskLevel === 'High'
                ? 'critical'
                : entry.riskLevel === 'Moderate'
                  ? 'warning'
                  : 'positive';

            return (
              <Link
                className={`patient-directory-item ${active ? 'active' : ''}`}
                key={entry.id}
                to={`/patients/${entry.id}`}
              >
                <div>
                  <strong>{entry.name}</strong>
                  <p>
                    {entry.room} · {entry.primaryCondition}
                  </p>
                </div>
                <Badge tone={tone}>{entry.riskLevel}</Badge>
              </Link>
            );
          })}
        </div>
      </aside>

      <div className="patient-content">
        <section className="patient-hero">
          <div>
            <p className="page-eyebrow">{patient.mrn}</p>
            <h2>{patient.name}</h2>
            <p className="patient-hero-copy">{patient.carePlanSummary}</p>
          </div>

          <div className="chip-row">
            <Badge tone={patient.riskLevel === 'High' ? 'critical' : patient.riskLevel === 'Moderate' ? 'warning' : 'positive'}>
              {patient.riskLevel} risk
            </Badge>
            <Badge tone={patient.status === 'Escalated' ? 'critical' : patient.status === 'Monitoring' ? 'warning' : 'positive'}>
              {patient.status}
            </Badge>
          </div>
        </section>

        <div className="patient-summary-grid">
          <article className="patient-metric-card">
            <span>Attending clinician</span>
            <strong>{patient.attendingClinician}</strong>
            <p>Next review: {patient.nextReview}</p>
          </article>
          <article className="patient-metric-card">
            <span>Profile</span>
            <strong>
              {patient.age} years · {patient.gender}
            </strong>
            <p>Room {patient.room}</p>
          </article>
          <article className="patient-metric-card">
            <span>Last updated</span>
            <strong>{patient.lastUpdated}</strong>
            <p>{patient.alerts[0]}</p>
          </article>
        </div>

        <div className="patient-panel-grid">
          <Panel title="Key vitals" subtitle="Most recent operationally relevant observations.">
            <div className="vitals-grid">
              {patient.vitals.map((vital) => (
                <article className="vital-card" key={vital.label}>
                  <span>{vital.label}</span>
                  <strong>{vital.value}</strong>
                  <p>{vital.trend}</p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="Medication plan" subtitle="Current medications on the active chart.">
            <div className="tag-list">
              {patient.medications.map((medication) => (
                <span className="tag-chip" key={medication}>
                  {medication}
                </span>
              ))}
            </div>
          </Panel>

          <Panel title="Care tasks" subtitle="Outstanding ownership items before next review.">
            <div className="task-list">
              {patient.tasks.map((task) => (
                <article className="task-row" key={task.id}>
                  <div>
                    <strong>{task.label}</strong>
                    <p>
                      {task.owner} · Due {task.due}
                    </p>
                  </div>
                  <Badge tone={task.done ? 'positive' : 'warning'}>{task.done ? 'Done' : 'Open'}</Badge>
                </article>
              ))}
            </div>
          </Panel>
        </div>

        <Panel
          title="Patient milestones"
          subtitle="The same patient dataset can be reviewed in grid or list mode."
          action={<SegmentedControl value={patientView} onChange={setPatientView} />}
        >
          {patientView === 'grid' ? (
            <div className="milestone-grid">
              {patient.milestones.map((milestone) => (
                <article className="milestone-card" key={milestone.id}>
                  <div className="milestone-card-head">
                    <span>{milestone.type}</span>
                    <Badge
                      tone={
                        milestone.status === 'Completed'
                          ? 'positive'
                          : milestone.status === 'Blocked'
                            ? 'critical'
                            : 'warning'
                      }
                    >
                      {milestone.status}
                    </Badge>
                  </div>
                  <strong>{milestone.title}</strong>
                  <p>{milestone.description}</p>
                  <div className="milestone-card-meta">
                    <span>{milestone.owner}</span>
                    <span>{milestone.date}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="milestone-list">
              {patient.milestones.map((milestone) => (
                <article className="milestone-list-row" key={milestone.id}>
                  <div>
                    <strong>{milestone.title}</strong>
                    <p>{milestone.description}</p>
                  </div>
                  <span>{milestone.type}</span>
                  <span>{milestone.owner}</span>
                  <span>{milestone.date}</span>
                  <Badge
                    tone={
                      milestone.status === 'Completed'
                        ? 'positive'
                        : milestone.status === 'Blocked'
                          ? 'critical'
                          : 'warning'
                    }
                  >
                    {milestone.status}
                  </Badge>
                </article>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
};
