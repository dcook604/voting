import { Router } from 'express';

import { attachmentsRouter } from './attachments.js';
import { authRouter } from './auth.js';
import { batchesRouter } from './batches.js';
import { exportsRouter } from './exports.js';
import { healthRouter } from './health.js';
import { infractionsRouter } from './infractions.js';
import { votesRouter } from './votes.js';

export const router = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(batchesRouter);
router.use(infractionsRouter);
router.use(votesRouter);
router.use(exportsRouter);
router.use(attachmentsRouter);

router.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Not Found' });
});
