import { Link } from 'react-router-dom';

import { BatchCard } from '../components/BatchCard';
import { useBatches } from '../hooks/useBatches';
import { useSession } from '../store/useSession';

export const Dashboard = () => {
  const { data, isLoading } = useBatches();
  const { role } = useSession();

  if (isLoading) {
    return <p>Loading batches…</p>;
  }

  return (
    <section>
      <header className="page-header">
        <div>
          <p className="eyebrow">{role.toUpperCase()} VIEW</p>
          <h1>Voting dashboard</h1>
          <p className="lede">Track current infractions, deadlines, and voting progress.</p>
        </div>
        {role === 'admin' && (
          <Link to="/batches/new" className="create-button">
            Create Batch
          </Link>
        )}
      </header>
      <div className="grid">
        {data && data.length > 0 ? (
          data.map((batch) => <BatchCard key={batch.id} batch={batch} />)
        ) : (
          <p>No batches available.</p>
        )}
      </div>
    </section>
  );
};
