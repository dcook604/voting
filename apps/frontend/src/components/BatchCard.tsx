import { Link } from 'react-router-dom';

import type { Batch } from '../types';

type Props = {
  batch: Batch;
};

export const BatchCard = ({ batch }: Props) => {
  const dueSoon = new Date(batch.deadline).getTime() - Date.now() < 72 * 60 * 60 * 1000;

  return (
    <article className="batch-card">
      <header>
        <p className="batch-card__mode">Mode: {batch.votingMode}</p>
        <p className={`batch-card__status ${batch.finalized ? 'finalized' : ''}`}>
          {batch.finalized ? 'Finalized' : dueSoon ? 'Due soon' : 'Open'}
        </p>
      </header>
      <h3>{batch.title}</h3>
      <p className="batch-card__description">{batch.description}</p>
      <dl className="batch-card__meta">
        <div>
          <dt>Deadline</dt>
          <dd>{new Date(batch.deadline).toLocaleString()}</dd>
        </div>
        <div>
          <dt>Infractions</dt>
          <dd>
            {batch.totalInfractions - batch.remainingInfractions}/{batch.totalInfractions} voted
          </dd>
        </div>
      </dl>
      <Link to={`/batches/${batch.id}`} className="batch-card__link">
        View details
      </Link>
    </article>
  );
};
