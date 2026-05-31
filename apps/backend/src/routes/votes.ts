import { Router } from 'express';
import { z } from 'zod';

import { auditService } from '../modules/audit/service.js';
import { batchService } from '../modules/batches/service.js';
import { infractionService } from '../modules/infractions/service.js';
import { voteService } from '../modules/votes/service.js';

const voteSchema = z.object({
  userId: z.string().min(1),
  vote: z.enum(['yes', 'no', 'abstain'])
});

export const votesRouter = Router();

votesRouter.post('/infractions/:id/vote', async (req, res, next) => {
  try {
    const { userId, vote } = voteSchema.parse(req.body);
    const infraction = await infractionService.findById(req.params.id);

    if (!infraction) {
      return res.status(404).json({ success: false, error: 'Infraction not found' });
    }

    const batch = await batchService.findById(infraction.batchId);
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    if (batch.finalized) {
      return res.status(400).json({ success: false, error: 'Batch finalized; voting closed' });
    }

    if (batch.deadline && batch.deadline.getTime() < Date.now()) {
      return res.status(400).json({ success: false, error: 'Voting deadline has passed' });
    }

    const voteRecord = await voteService.castVote({
      infractionId: infraction.id,
      userId,
      voteValue: vote
    });

    await auditService.log({
      actorId: userId,
      action: 'vote.cast',
      objectType: 'infraction',
      objectId: infraction.id,
      details: {
        voteValue: vote,
        hash: voteRecord.hash,
        previousHash: voteRecord.previousHash
      }
    });

    res.status(201).json({ success: true, data: voteRecord });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors[0]?.message ?? 'Invalid payload' });
    }

    next(error);
  }
});

votesRouter.get('/infractions/:id/results', async (req, res) => {
  const infraction = await infractionService.findById(req.params.id);

  if (!infraction) {
    return res.status(404).json({ success: false, error: 'Infraction not found' });
  }

  const results = await voteService.getResults(infraction.id);
  res.json({ success: true, data: results });
});

votesRouter.get('/users/:id/votes', async (req, res) => {
  const votes = await voteService.getUserVotes(req.params.id);
  res.json({
    success: true,
    data: Object.values(votes)
  });
});

votesRouter.get('/batches/:id/public-results', async (req, res) => {
  const batch = await batchService.findById(req.params.id);

  if (!batch) {
    return res.status(404).json({ success: false, error: 'Batch not found' });
  }

  const infractions = await infractionService.findByBatchId(batch.id);
  const totals = { yes: 0, no: 0, abstain: 0, cast: 0 };

  for (const infraction of infractions) {
    const results = await voteService.getResults(infraction.id);
    totals.yes += results.summary.yes;
    totals.no += results.summary.no;
    totals.abstain += results.summary.abstain;
    totals.cast += results.summary.total;
  }

  const isDeadlinePassed = batch.deadline && batch.deadline.getTime() < Date.now();
  const isClosed = batch.finalized || !!isDeadlinePassed;
  const closeReason = isClosed
    ? isDeadlinePassed
      ? 'Voting period ended'
      : 'Finalized by administrator'
    : null;

  let outcome: string | null = null;
  if (isClosed) {
    if (totals.cast === 0) outcome = 'No votes cast';
    else if (totals.yes > totals.no) outcome = 'Passed';
    else if (totals.no > totals.yes) outcome = 'Failed';
    else outcome = 'Tied';
  }

  res.json({
    success: true,
    data: {
      batchId: batch.id,
      title: batch.title,
      finalized: batch.finalized,
      deadline: batch.deadline,
      isClosed,
      closeReason,
      results: { ...totals, outcome }
    }
  });
});
