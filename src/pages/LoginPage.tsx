import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';
import { firebaseSetupHint, isFirebaseConfigured } from '../lib/firebase';
import { useAppStore } from '../store/app-store';

interface FormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const validate = ({ email, password }: FormState): FormErrors => {
  const errors: FormErrors = {};

  if (!email.trim()) {
    errors.email = 'Work email is required.';
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  return errors;
};

export const LoginPage = () => {
  const [form, setForm] = useState<FormState>({
    email: isFirebaseConfigured ? '' : 'demo@careaxis.health',
    password: isFirebaseConfigured ? '' : 'Health123!',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const authStatus = useAppStore((state) => state.authStatus);
  const login = useAppStore((state) => state.login);
  const loginError = useAppStore((state) => state.loginError);
  const clearLoginError = useAppStore((state) => state.clearLoginError);

  // const demoBanner = useMemo(() => {
  //   if (isFirebaseConfigured) {
  //     return 'Firebase authentication is active. Sign in with a valid project user.';
  //   }

  //   return `${firebaseSetupHint} Demo mode is enabled for reviewers.`;
  // }, []);

  if (authStatus === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (loginError) {
      clearLoginError();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await login(form.email, form.password);
    } catch {
      // Store already captures the user-facing message.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <div className="auth-intro">
          <p className="page-eyebrow">Healthcare operations suite</p>
          <h1>Coordinate patient flow, analytics, and care alerts from one control surface.</h1>
          <p className="auth-copy">
            CareAxis gives operations leaders a clean command layer for admissions, patient follow-ups,
            care transitions, and escalation monitoring.
          </p>
        </div>

        <div className="auth-kpi-grid">
          <article className="auth-kpi-card">
            <span>Bed turnover</span>
            <strong>3.4h</strong>
            <p>Average discharge-to-clean-room cycle this week.</p>
          </article>
          <article className="auth-kpi-card">
            <span>Escalation closure</span>
            <strong>93%</strong>
            <p>Resolved without missed care-transition handoffs.</p>
          </article>
          <article className="auth-kpi-card">
            <span>Teams connected</span>
            <strong>12</strong>
            <p>Clinical, pharmacy, finance, and discharge operations modules.</p>
          </article>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-card">
          

          <div className="auth-form-heading">
            <h2>Sign in to CareAxis</h2>
            <p>Use a care operations account to access dashboards, analytics, and patient workflows.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <InputField
              id="email"
              label="Work email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
              error={errors.email}
            />
            <InputField
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => handleChange('password', event.target.value)}
              error={errors.password}
              hint={!isFirebaseConfigured ? 'Demo credentials are prefilled for assignment review.' : undefined}
            />

            {loginError ? <div className="inline-alert">{loginError}</div> : null}

            <Button type="submit" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Login'}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};
