import { Link, useParams } from 'react-router-dom';

import { useBatchDetail } from '../hooks/useBatches';

export const BatchDetail = () => {
  const { id = '' } = useParams();
  const { data, isLoading } = useBatchDetail(id);

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

  return (
    <section>
      <Link to="/" className="back-link">
        ← Back to dashboard
      </Link>
      <header className="page-header">
        <div>
          <p className="eyebrow">{data.votingMode} mode</p>
          <h1>{data.title}</h1>
          <p className="lede">Deadline: {new Date(data.deadline).toLocaleString()}</p>
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
                <p>Attachments: {infraction.attachments.length}</p>
                <button type="button" className="vote-button">
                  Vote now
                </button>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};
