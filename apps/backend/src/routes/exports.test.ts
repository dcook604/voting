import request from 'supertest';

import { createApp } from '../server.js';

describe('exports routes', () => {
  const app = createApp();

  it('exports batch as CSV', async () => {
    const batchRes = await request(app)
      .post('/api/v1/batches')
      .send({
        title: 'Export Test Batch',
        createdBy: 'admin@example.com'
      });

    const batchId = batchRes.body.data.id;

    await request(app)
      .post(`/api/v1/batches/${batchId}/infractions`)
      .send({
        unit: 'PH-02',
        reportedDate: '2025-10-14T00:00:00Z',
        bylawReference: 'Parking Bylaw 4.3',
        summary: 'Test infraction',
        recommendedAction: 'Issue warning'
      });

    const res = await request(app).get(`/api/v1/batches/${batchId}/export/csv`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.text).toContain('Export Test Batch');
    expect(res.text).toContain('PH-02');
  });

  it('exports batch as PDF', async () => {
    const batchRes = await request(app)
      .post('/api/v1/batches')
      .send({
        title: 'PDF Export Test',
        createdBy: 'admin@example.com'
      });

    const batchId = batchRes.body.data.id;

    await request(app)
      .post(`/api/v1/batches/${batchId}/infractions`)
      .send({
        unit: '1205',
        reportedDate: '2025-10-20T00:00:00Z',
        bylawReference: 'Maintenance Bylaw 7.1',
        summary: 'Oil leak',
        recommendedAction: 'Request repair'
      });

    const res = await request(app).get(`/api/v1/batches/${batchId}/export/pdf`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/pdf');
    expect(res.body).toBeInstanceOf(Buffer);
  });
});

