import { Link } from 'react-router-dom';

import { useSession } from '../store/useSession';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { role, setRole } = useSession();

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          Strata Remote Voting
        </Link>
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
      </header>
      <main>{children}</main>
    </div>
  );
};
