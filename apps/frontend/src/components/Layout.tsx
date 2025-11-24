import { Link } from 'react-router-dom';

import { useSession } from '../store/useSession';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { role, email, setRole, logout } = useSession();
  const isAuthenticated = !!localStorage.getItem('auth_token');

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          Strata Remote Voting
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {isAuthenticated && email && (
            <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{email}</span>
          )}
          {!isAuthenticated && (
            <Link to="/login" style={{ color: '#38bdf8', textDecoration: 'none' }}>
              Login
            </Link>
          )}
          {isAuthenticated && (
            <button
              onClick={logout}
              style={{
                padding: '0.4rem 0.75rem',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '0.5rem',
                color: '#ef4444',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          )}
          <div className="role-switcher">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value as typeof role)}
            >
              <option value="admin">Admin</option>
              <option value="council">Council</option>
              <option value="observer">Observer</option>
            </select>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};
