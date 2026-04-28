import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { PublicOnlyRoute } from '../components/auth/PublicOnlyRoute';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { PatientDetailsPage } from '../pages/PatientDetailsPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { patients } from '../data/patients';

export const router = createBrowserRouter([
  {
    path: '/loging',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'patients', element: <Navigate to={`/patients/${patients[0].id}`} replace /> },
      { path: 'patients/:patientId', element: <PatientDetailsPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
