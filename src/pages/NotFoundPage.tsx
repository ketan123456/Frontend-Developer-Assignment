import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className="app-splash">
    <div className="app-splash-card">
      <h2>Page not found</h2>
      <p>The requested route does not exist in this healthcare workspace.</p>
      <Link className="button button--primary" to="/dashboard">
        Back to dashboard
      </Link>
    </div>
  </div>
);
