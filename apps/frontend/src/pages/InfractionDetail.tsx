import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../api/client';
import { VotingButtons } from '../components/VotingButtons';
import { useSession } from '../store/useSession';

export const InfractionDetail = () => {
  const { batchId, infractionId } = useParams();
  const { role } = useSession();
  const userId = localStorage.getItem('user_email') || 'anonymous';

  const { data: batch, isLoading } = useQuery({
    queryKey: ['batches', batchId],
    queryFn: () => apiClient.getBatch(batchId!),
    enabled: !!batchId
  });

  const infraction = batch?.infractions.find((i) => i.id === infractionId);
  const canVote = !batch?.finalized && batch?.deadline && new Date(batch.deadline) > new Date();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!infraction) {
    return (
      <section>
        <p>Infraction not found.</p>
        <Link to={`/batches/${batchId}`}>Back to batch</Link>
      </section>
    );
  }

  return (
    <section>
      <Link to={`/batches/${batchId}`} className="back-link">
        ← Back to batch
      </Link>
      <header className="page-header">
        <div>
          <p className="eyebrow">Unit {infraction.unit}</p>
          <h1>{infraction.summary}</h1>
        </div>
      </header>

      <div className="infraction-detail">
        <dl>
          <div>
            <dt>Bylaw Reference</dt>
            <dd>{infraction.bylawReference}</dd>
          </div>
          <div>
            <dt>Reported Date</dt>
            <dd>{new Date(infraction.reportedDate).toLocaleDateString()}</dd>
          </div>
          <div>
            <dt>Recommended Action</dt>
            <dd>{infraction.recommendedAction}</dd>
          </div>
        </dl>

        {role === 'council' && canVote && (
          <div className="voting-section">
            <h2>Cast Your Vote</h2>
            <VotingButtons
              infractionId={infraction.id}
              userId={userId}
              disabled={!canVote}
            />
          </div>
        )}

        {batch?.finalized && (
          <div className="finalized-notice">
            <p>This batch has been finalized. Voting is closed.</p>
          </div>
        )}
      </div>
    </section>
  );
};

