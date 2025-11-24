import { Router } from 'express';

import { batchService } from '../modules/batches/service.js';
import { generateCSV } from '../modules/exports/csvExporter.js';
import { generatePDF } from '../modules/exports/pdfExporter.js';
import { infractionService } from '../modules/infractions/service.js';
import { voteService } from '../modules/votes/service.js';

export const exportsRouter = Router();

exportsRouter.get('/batches/:id/export/csv', async (req, res) => {
  const batch = await batchService.findById(req.params.id);
  
  if (!batch) {
    return res.status(404).json({ success: false, error: 'Batch not found' });
  }
  
  const infractions = await infractionService.findByBatchId(batch.id);
  const allVotes: Array<{ infractionId: string; vote: any }> = [];
  
  for (const infraction of infractions) {
    const results = await voteService.getResults(infraction.id);
    results.latestVotes.forEach((vote) => {
      allVotes.push({ infractionId: infraction.id, vote });
    });
  }
  
  const csv = generateCSV({
    batch,
    infractions,
    votes: allVotes.map((v) => v.vote)
  });
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="batch-${batch.id}-export.csv"`);
  res.send(csv);
});

exportsRouter.get('/batches/:id/export/pdf', async (req, res) => {
  const batch = await batchService.findById(req.params.id);
  
  if (!batch) {
    return res.status(404).json({ success: false, error: 'Batch not found' });
  }
  
  const infractions = await infractionService.findByBatchId(batch.id);
  const allVotes: Array<{ infractionId: string; vote: any }> = [];
  
  for (const infraction of infractions) {
    const results = await voteService.getResults(infraction.id);
    results.latestVotes.forEach((vote) => {
      allVotes.push({ infractionId: infraction.id, vote });
    });
  }
  
  const pdf = await generatePDF({
    batch,
    infractions,
    votes: allVotes.map((v) => v.vote),
    finalizedBy: req.query.finalizedBy as string | undefined
  });
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="batch-${batch.id}-export.pdf"`);
  res.send(pdf);
});

