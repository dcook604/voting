import { Router } from 'express';
import { z } from 'zod';

import { auditService } from '../modules/audit/service.js';
import { batchService } from '../modules/batches/service.js';
import type { VotingMode } from '../modules/batches/types.js';
import { infractionService } from '../modules/infractions/service.js';
import { parseCSVInfractions } from '../modules/infractions/csvParser.js';
import { mailer } from '../modules/notifications/mailer.js';
import { voteService } from '../modules/votes/service.js';

const createBatchSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  createdBy: z.string().min(1),
  votingMode: z.enum(['tracked', 'anonymized', 'blind']).optional(),
  deadline: z.string().datetime().optional()
});

const updateBatchSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  votingMode: z.enum(['tracked', 'anonymized', 'blind']).optional(),
  deadline: z.string().datetime().optional().nullable(),
  finalized: z.boolean().optional()
});

export const batchesRouter = Router();

batchesRouter.post('/batches', async (req, res, next) => {
  try {
    const input = createBatchSchema.parse(req.body);
    const batch = await batchService.create(input);

    res.status(201).json({ success: true, data: batch });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors[0]?.message ?? 'Invalid payload' });
    }

    next(error);
  }
});

batchesRouter.get('/batches', async (_req, res) => {
  const batches = await batchService.findAll();
  res.json({ success: true, data: batches });
});

batchesRouter.get('/batches/:id', async (req, res) => {
  const batch = await batchService.findById(req.params.id);

  if (!batch) {
    return res.status(404).json({ success: false, error: 'Batch not found' });
  }

  const infractions = await infractionService.findByBatchId(batch.id);

  res.json({
    success: true,
    data: {
      ...batch,
      infractions
    }
  });
});

batchesRouter.patch('/batches/:id', async (req, res, next) => {
  try {
    const input = updateBatchSchema.parse(req.body);
    const existingBatch = await batchService.findById(req.params.id);

    if (!existingBatch) {
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    const wasFinalized = existingBatch.finalized;
    const batch = await batchService.update(req.params.id, input);

    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    if (input.finalized && !wasFinalized) {
      await auditService.log({
        actorId: req.body.finalizedBy ?? 'system',
        action: 'batch.finalize',
        objectType: 'batch',
        objectId: batch.id,
        details: { batchTitle: batch.title }
      });

      try {
        const infractions = await infractionService.findByBatchId(batch.id);
        const totals = { yes: 0, no: 0, abstain: 0, cast: 0 };
        for (const infraction of infractions) {
          const r = await voteService.getResults(infraction.id);
          totals.yes += r.summary.yes;
          totals.no += r.summary.no;
          totals.abstain += r.summary.abstain;
          totals.cast += r.summary.total;
        }
        const isDeadlinePassed = batch.deadline && batch.deadline.getTime() < Date.now();
        const outcome =
          totals.cast === 0
            ? 'No votes cast'
            : totals.yes > totals.no
              ? 'Passed'
              : totals.no > totals.yes
                ? 'Failed'
                : 'Tied';

        await mailer.sendFinalizationEmail({
          to: batch.createdBy,
          batchTitle: batch.title,
          batchId: batch.id,
          closeReason: isDeadlinePassed ? 'Voting period ended' : 'Finalized by administrator',
          results: { ...totals, outcome }
        });
      } catch (emailError) {
        console.error('Failed to send finalization email:', emailError);
      }
    }

    res.json({ success: true, data: batch });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors[0]?.message ?? 'Invalid payload' });
    }

    next(error);
  }
});

batchesRouter.delete('/batches/:id', async (req, res) => {
  const deleted = await batchService.delete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Batch not found' });
  }

  res.status(204).send();
});

