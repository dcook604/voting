import { Link, useParams } from 'react-router-dom';

import { useBatchDetail } from '../hooks/useBatches';
import { useSession } from '../store/useSession';

export const BatchDetail = () => {
  const { id = '' } = useParams();
  const { data, isLoading } = useBatchDetail(id);
  const { role } = useSession();

  if (isLoading) {
    return <p>Loading batch…</p>;
  }

  if (!data) {
    return (
      <section>
        <p>Batch not found.</p>
        <Link to="/">Back to dashboard</Link>
      </section>
    );
  }

  const deadline = data.deadline ? new Date(data.deadline) : null;
  const isPastDeadline = deadline && deadline < new Date();
  const canVote = !data.finalized && !isPastDeadline;

  return (
    <section>
      <Link to="/" className="back-link">
        ← Back to dashboard
      </Link>
      <header className="page-header">
        <div>
          <p className="eyebrow">{data.votingMode} mode</p>
          <h1>{data.title}</h1>
          <p className="lede">
            {deadline ? `Deadline: ${deadline.toLocaleString()}` : 'No deadline set'}
            {data.finalized && ' • Finalized'}
          </p>
        </div>
      </header>
      <p>{data.description}</p>
      <h2>Infractions</h2>
      {data.infractions.length === 0 && <p>No infractions imported yet.</p>}
      <ol className="infraction-list">
        {data.infractions.map((infraction) => (
          <li key={infraction.id}>
            <div className="infraction-card">
              <div>
                <p className="eyebrow">Unit {infraction.unit}</p>
                <h3>{infraction.summary}</h3>
                <p className="bylaw">Bylaw {infraction.bylawReference}</p>
                <p className="recommendation">{infraction.recommendedAction}</p>
              </div>
              <div className="infraction-meta">
                <p>Reported: {new Date(infraction.reportedDate).toLocaleDateString()}</p>
                {role === 'council' && canVote && (
                  <Link to={`/batches/${id}/infractions/${infraction.id}`} className="vote-button">
                    Vote now
                  </Link>
                )}
                {(!canVote || role !== 'council') && (
                  <Link to={`/batches/${id}/infractions/${infraction.id}`} className="view-button">
                    View details
                  </Link>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};
