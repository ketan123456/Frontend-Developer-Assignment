import type { PropsWithChildren, ReactNode } from 'react';

interface PanelProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export const Panel = ({
  title,
  subtitle,
  action,
  className = '',
  children,
}: PropsWithChildren<PanelProps>) => (
  <section className={`panel ${className}`.trim()}>
    {title || subtitle || action ? (
      <div className="panel-header">
        <div>
          {title ? <h3 className="panel-title">{title}</h3> : null}
          {subtitle ? <p className="panel-subtitle">{subtitle}</p> : null}
        </div>
        {action}
      </div>
    ) : null}
    {children}
  </section>
);
