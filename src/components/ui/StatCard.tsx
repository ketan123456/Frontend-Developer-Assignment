import type { StatMetric } from '../../types';

export const StatCard = ({ label, value, delta }: StatMetric) => (
  <article className="stat-card">
    <span className="stat-label">{label}</span>
    <strong className="stat-value">{value}</strong>
    <span className="stat-delta">{delta}</span>
  </article>
);
