import { Link } from 'react-router-dom';

import type { Batch } from '../types';

type Props = {
  batch: Batch;
};

export const BatchCard = ({ batch }: Props) => {
  const deadline = batch.deadline ? new Date(batch.deadline) : null;
  const dueSoon = deadline && deadline.getTime() - Date.now() < 72 * 60 * 60 * 1000;
  const isPastDeadline = deadline && deadline < new Date();

  return (
    <article className="batch-card">
      <header>
        <p className="batch-card__mode">Mode: {batch.votingMode}</p>
        <p className={`batch-card__status ${batch.finalized ? 'finalized' : isPastDeadline ? 'past-deadline' : dueSoon ? 'due-soon' : ''}`}>
          {batch.finalized ? 'Finalized' : isPastDeadline ? 'Past deadline' : dueSoon ? 'Due soon' : 'Open'}
        </p>
      </header>
      <h3>{batch.title}</h3>
      <p className="batch-card__description">{batch.description}</p>
      <dl className="batch-card__meta">
        <div>
          <dt>Deadline</dt>
          <dd>{deadline ? deadline.toLocaleString() : 'No deadline'}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{batch.finalized ? 'Finalized' : 'Active'}</dd>
        </div>
      </dl>
      <Link to={`/batches/${batch.id}`} className="batch-card__link">
        View details
      </Link>
    </article>
  );
};
