import request from 'supertest';

import { createApp } from '../server.js';

describe('batches routes', () => {
  const app = createApp();

  it('creates a batch', async () => {
    const res = await request(app)
      .post('/api/v1/batches')
      .send({
        title: 'Q1 2025 Parking Violations',
        description: 'Review parking infractions',
        createdBy: 'admin@example.com',
        votingMode: 'tracked'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Q1 2025 Parking Violations');
    expect(res.body.data.votingMode).toBe('tracked');
  });

  it('lists all batches', async () => {
    await request(app)
      .post('/api/v1/batches')
      .send({
        title: 'Test Batch',
        createdBy: 'admin@example.com'
      });

    const res = await request(app).get('/api/v1/batches');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('gets a batch by id with infractions', async () => {
    const createRes = await request(app)
      .post('/api/v1/batches')
      .send({
        title: 'Test Batch',
        createdBy: 'admin@example.com'
      });

    const batchId = createRes.body.data.id;

    const res = await request(app).get(`/api/v1/batches/${batchId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(batchId);
    expect(Array.isArray(res.body.data.infractions)).toBe(true);
  });

  it('updates a batch', async () => {
    const createRes = await request(app)
      .post('/api/v1/batches')
      .send({
        title: 'Original Title',
        createdBy: 'admin@example.com'
      });

    const batchId = createRes.body.data.id;

    const res = await request(app)
      .patch(`/api/v1/batches/${batchId}`)
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Updated Title');
  });

  it('deletes a batch', async () => {
    const createRes = await request(app)
      .post('/api/v1/batches')
      .send({
        title: 'To Delete',
        createdBy: 'admin@example.com'
      });

    const batchId = createRes.body.data.id;

    const res = await request(app).delete(`/api/v1/batches/${batchId}`);

    expect(res.status).toBe(204);
  });
});

