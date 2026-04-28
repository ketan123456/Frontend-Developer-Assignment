import type { PropsWithChildren } from 'react';

type BadgeTone = 'default' | 'positive' | 'warning' | 'critical';

interface BadgeProps {
  tone?: BadgeTone;
}

export const Badge = ({
  tone = 'default',
  children,
}: PropsWithChildren<BadgeProps>) => <span className={`badge badge--${tone}`}>{children}</span>;
