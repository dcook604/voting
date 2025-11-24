import request from 'supertest';

import { createApp } from '../server.js';

describe('votes routes', () => {
  const app = createApp();

  const createBatchAndInfraction = async (overrides?: { deadline?: string; finalized?: boolean }) => {
    const batchRes = await request(app)
      .post('/api/v1/batches')
      .send({
        title: 'Voting Batch',
        createdBy: 'admin@example.com',
        deadline: overrides?.deadline ?? new Date(Date.now() + 60 * 60 * 1000).toISOString()
      });

    const batchId = batchRes.body.data.id;

    if (overrides?.finalized) {
      await request(app).patch(`/api/v1/batches/${batchId}`).send({ finalized: true });
    }

    const infractionRes = await request(app)
      .post(`/api/v1/batches/${batchId}/infractions`)
      .send({
        unit: 'PH-02',
        reportedDate: '2025-10-14T00:00:00Z',
        bylawReference: 'Parking Bylaw 4.3',
        summary: 'Overnight parking violation',
        recommendedAction: 'Issue warning'
      });

    return { batchId, infractionId: infractionRes.body.data.id };
  };

  it('allows voting and aggregates results', async () => {
    const { infractionId } = await createBatchAndInfraction();

    const voteRes = await request(app)
      .post(`/api/v1/infractions/${infractionId}/vote`)
      .send({ userId: 'user-1', vote: 'yes' });

    expect(voteRes.status).toBe(201);
    expect(voteRes.body.success).toBe(true);
    expect(voteRes.body.data.voteValue).toBe('yes');
    expect(voteRes.body.data.hash).toBeDefined();

    const resultsRes = await request(app).get(`/api/v1/infractions/${infractionId}/results`);
    expect(resultsRes.status).toBe(200);
    expect(resultsRes.body.data.summary.yes).toBe(1);

    const userVotesRes = await request(app).get('/api/v1/users/user-1/votes');
    expect(userVotesRes.body.data[0].infractionId).toBe(infractionId);
  });

  it('prevents voting after deadline', async () => {
    const { infractionId } = await createBatchAndInfraction({
      deadline: new Date(Date.now() - 60 * 60 * 1000).toISOString()
    });

    const res = await request(app)
      .post(`/api/v1/infractions/${infractionId}/vote`)
      .send({ userId: 'late-user', vote: 'no' });

    expect(res.status).toBe(400);
  });

  it('prevents voting once batch is finalized', async () => {
    const { infractionId } = await createBatchAndInfraction({ finalized: true });

    const res = await request(app)
      .post(`/api/v1/infractions/${infractionId}/vote`)
      .send({ userId: 'late-user', vote: 'no' });

    expect(res.status).toBe(400);
  });
});
