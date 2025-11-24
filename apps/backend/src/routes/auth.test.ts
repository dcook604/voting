import request from 'supertest';

import { createApp } from '../server.js';

describe('auth routes', () => {
  const app = createApp();

  it('creates invitation tokens and exchanges them for JWTs', async () => {
    const inviteRes = await request(app)
      .post('/api/v1/auth/magic-link')
      .send({ email: 'council@example.com', role: 'council' });

    expect(inviteRes.status).toBe(200);
    expect(inviteRes.body.success).toBe(true);

    const token = inviteRes.body.data.token as string;
    expect(token).toBeDefined();

    const authRes = await request(app).post('/api/v1/auth/token').send({ token });

    expect(authRes.status).toBe(200);
    expect(authRes.body.success).toBe(true);
    expect(authRes.body.data.user.email).toBe('council@example.com');
    expect(authRes.body.data.token).toBeDefined();
  });

  it('rejects invalid tokens', async () => {
    const res = await request(app)
      .post('/api/v1/auth/token')
      .send({ token: 'invalid-token-12345' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
