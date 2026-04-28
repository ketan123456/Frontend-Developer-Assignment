export type AuthMode = 'firebase' | 'demo';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export type PatientView = 'grid' | 'list';

export type BrowserNotificationPermission = NotificationPermission | 'unsupported';

export interface AuthUser {
  uid: string;
  name: string;
  email: string;
  role: string;
  mode: AuthMode;
}

export interface StatMetric {
  label: string;
  value: string;
  delta: string;
}

export interface PatientVital {
  label: string;
  value: string;
  trend: string;
}

export interface CareMilestone {
  id: string;
  title: string;
  type: string;
  date: string;
  owner: string;
  status: 'Scheduled' | 'In progress' | 'Completed' | 'Blocked';
  description: string;
}

export interface PatientTask {
  id: string;
  label: string;
  due: string;
  owner: string;
  done: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  mrn: string;
  room: string;
  status: 'Stable' | 'Monitoring' | 'Escalated';
  riskLevel: 'Low' | 'Moderate' | 'High';
  primaryCondition: string;
  attendingClinician: string;
  nextReview: string;
  lastUpdated: string;
  carePlanSummary: string;
  medications: string[];
  alerts: string[];
  vitals: PatientVital[];
  milestones: CareMilestone[];
  tasks: PatientTask[];
}

export interface NotificationRecord {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  destination: string;
}
