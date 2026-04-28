import { analyticsHighlights, careLoad, departmentResponse, throughputTrend } from '../data/analytics';
import { Panel } from '../components/ui/Panel';
import { StatCard } from '../components/ui/StatCard';

const buildLinePath = (values: number[], width: number, height: number) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
};

export const AnalyticsPage = () => {
  const trendValues = throughputTrend.map((entry) => entry.value);
  const trendPath = buildLinePath(trendValues, 360, 160);

  return (
    <div className="page-stack">
      <div className="stat-grid">
        {analyticsHighlights.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="analytics-grid">
        <Panel title="Throughput trend" subtitle="Completed patient movements over the last seven days.">
          <div className="trend-chart-shell">
            <svg className="trend-chart" viewBox="0 0 360 180" role="img" aria-label="Weekly throughput trend">
              <path d={trendPath} />
              {throughputTrend.map((entry, index) => {
                const max = Math.max(...trendValues);
                const min = Math.min(...trendValues);
                const range = max - min || 1;
                const x = (index / (throughputTrend.length - 1)) * 360;
                const y = 160 - ((entry.value - min) / range) * 160;
                return <circle key={entry.label} cx={x} cy={y} r="5" />;
              })}
            </svg>
            <div className="trend-axis">
              {throughputTrend.map((entry) => (
                <div key={entry.label}>
                  <strong>{entry.value}</strong>
                  <span>{entry.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="Department response" subtitle="Workflow completion rate by specialty service.">
          <div className="bar-stack">
            {departmentResponse.map((entry) => (
              <div className="bar-row" key={entry.label}>
                <div className="bar-copy">
                  <strong>{entry.label}</strong>
                  <span>{entry.value}%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${entry.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Care load distribution" subtitle="Current patient acuity split across the operating floor.">
          <div className="load-grid">
            {careLoad.map((entry) => (
              <article className={`load-card load-card--${entry.tone}`} key={entry.label}>
                <span>{entry.label}</span>
                <strong>{entry.value}%</strong>
                <p>of active cases</p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Planning notes" subtitle="What the metrics suggest right now.">
          <div className="insight-list">
            <article>
              <strong>Case management is the discharge bottleneck.</strong>
              <p>Authorization steps are trailing clinical readiness, so same-day discharge potential is being left on the table.</p>
            </article>
            <article>
              <strong>Respiratory service needs tighter reassessment windows.</strong>
              <p>Escalations close well, but resolution pacing dips when reassessments bunch together late in the shift.</p>
            </article>
            <article>
              <strong>Cardiology remains high-volume but stable.</strong>
              <p>Current throughput is strong, yet post-op handoff tasks are still the highest-risk transition point.</p>
            </article>
          </div>
        </Panel>
      </div>
    </div>
  );
};
