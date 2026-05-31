import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../api/client';

export const PublicResults = () => {
  const { batchId } = useParams<{ batchId: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-results', batchId],
    queryFn: () => apiClient.getPublicResults(batchId!),
    enabled: !!batchId
  });

  if (isLoading) {
    return (
      <section style={{ maxWidth: '480px', margin: '4rem auto', padding: '0 1rem' }}>
        <p>Loading results…</p>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section style={{ maxWidth: '480px', margin: '4rem auto', padding: '0 1rem' }}>
        <p>Results not found or not yet available.</p>
      </section>
    );
  }

  const outcomeColor =
    data.results.outcome === 'Passed'
      ? '#16a34a'
      : data.results.outcome === 'Failed'
        ? '#dc2626'
        : '#64748b';

  return (
    <section style={{ maxWidth: '520px', margin: '4rem auto', padding: '0 1rem' }}>
      <p style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
        Motion
      </p>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        {data.title}
      </h1>

      {data.closeReason && (
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          Close reason: {data.closeReason}
        </p>
      )}

      {!data.isClosed && (
        <p style={{ color: '#f59e0b', marginBottom: '1.5rem' }}>
          Voting is still open.
        </p>
      )}

      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '1rem' }}>
          Summary
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '0.4rem 0', color: '#94a3b8' }}>Cast</td>
              <td style={{ padding: '0.4rem 0', fontWeight: 600, textAlign: 'right' }}>{data.results.cast}</td>
            </tr>
            <tr>
              <td style={{ padding: '0.4rem 0', color: '#94a3b8' }}>Yes</td>
              <td style={{ padding: '0.4rem 0', fontWeight: 600, color: '#16a34a', textAlign: 'right' }}>{data.results.yes}</td>
            </tr>
            <tr>
              <td style={{ padding: '0.4rem 0', color: '#94a3b8' }}>No</td>
              <td style={{ padding: '0.4rem 0', fontWeight: 600, color: '#dc2626', textAlign: 'right' }}>{data.results.no}</td>
            </tr>
            <tr>
              <td style={{ padding: '0.4rem 0', color: '#94a3b8' }}>Abstain</td>
              <td style={{ padding: '0.4rem 0', fontWeight: 600, textAlign: 'right' }}>{data.results.abstain}</td>
            </tr>
            {data.results.outcome && (
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '0.75rem 0 0.4rem', color: '#94a3b8' }}>Outcome</td>
                <td style={{ padding: '0.75rem 0 0.4rem', fontWeight: 700, color: outcomeColor, textAlign: 'right', fontSize: '1.1rem' }}>
                  {data.results.outcome}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
