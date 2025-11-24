import { Router } from 'express';

import { healthRouter } from './health.js';

export const router = Router();

router.use(healthRouter);

router.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Not Found' });
});
