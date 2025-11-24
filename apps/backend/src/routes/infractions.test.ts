import request from 'supertest';

import { createApp } from '../server.js';

describe('infractions routes', () => {
  const app = createApp();

  let batchId: string;

  beforeEach(async () => {
    const batchRes = await request(app)
      .post('/api/v1/batches')
      .send({
        title: 'Test Batch',
        createdBy: 'admin@example.com'
      });

    batchId = batchRes.body.data.id;
  });

  it('creates an infraction', async () => {
    const res = await request(app)
      .post(`/api/v1/batches/${batchId}/infractions`)
      .send({
        unit: 'PH-02',
        reportedDate: '2025-10-14T00:00:00Z',
        bylawReference: 'Parking Bylaw 4.3',
        summary: 'Overnight parking violation',
        recommendedAction: 'Issue warning'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.unit).toBe('PH-02');
    expect(res.body.data.batchId).toBe(batchId);
  });

  it('lists infractions for a batch', async () => {
    await request(app)
      .post(`/api/v1/batches/${batchId}/infractions`)
      .send({
        unit: 'PH-02',
        reportedDate: '2025-10-14T00:00:00Z',
        bylawReference: 'Parking Bylaw 4.3',
        summary: 'Test',
        recommendedAction: 'Action'
      });

    const res = await request(app).get(`/api/v1/batches/${batchId}/infractions`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('gets an infraction by id', async () => {
    const createRes = await request(app)
      .post(`/api/v1/batches/${batchId}/infractions`)
      .send({
        unit: 'PH-02',
        reportedDate: '2025-10-14T00:00:00Z',
        bylawReference: 'Parking Bylaw 4.3',
        summary: 'Test',
        recommendedAction: 'Action'
      });

    const infractionId = createRes.body.data.id;

    const res = await request(app).get(`/api/v1/infractions/${infractionId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(infractionId);
  });

  it('deletes an infraction', async () => {
    const createRes = await request(app)
      .post(`/api/v1/batches/${batchId}/infractions`)
      .send({
        unit: 'PH-02',
        reportedDate: '2025-10-14T00:00:00Z',
        bylawReference: 'Parking Bylaw 4.3',
        summary: 'Test',
        recommendedAction: 'Action'
      });

    const infractionId = createRes.body.data.id;

    const res = await request(app).delete(`/api/v1/infractions/${infractionId}`);

    expect(res.status).toBe(204);
  });

  it('imports infractions from CSV', async () => {
    const csvContent = `unit,reported_date,bylaw_reference,summary,recommended_action
PH-02,2025-10-14T00:00:00Z,Parking Bylaw 4.3,Overnight parking,Issue warning
1205,2025-10-20T00:00:00Z,Maintenance Bylaw 7.1,Oil leak,Request repair`;

    const res = await request(app)
      .post(`/api/v1/batches/${batchId}/import`)
      .attach('csv', Buffer.from(csvContent), 'infractions.csv');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.imported).toBe(2);
    expect(res.body.data.infractions).toHaveLength(2);
  });
});

