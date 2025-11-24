import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';

import { batchService } from '../modules/batches/service.js';
import { infractionService } from '../modules/infractions/service.js';
import { parseCSVInfractions } from '../modules/infractions/csvParser.js';

const createInfractionSchema = z.object({
  unit: z.string().min(1),
  reportedDate: z.string().datetime(),
  bylawReference: z.string().min(1),
  summary: z.string().min(1),
  recommendedAction: z.string().min(1)
});

const upload = multer({ storage: multer.memoryStorage() });

export const infractionsRouter = Router();

infractionsRouter.post('/batches/:batchId/infractions', async (req, res, next) => {
  try {
    const batch = await batchService.findById(req.params.batchId);
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    const input = createInfractionSchema.parse(req.body);
    const infraction = await infractionService.create({ ...input, batchId: batch.id });

    res.status(201).json({ success: true, data: infraction });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors[0]?.message ?? 'Invalid payload' });
    }

    next(error);
  }
});

infractionsRouter.get('/batches/:batchId/infractions', async (req, res) => {
  const batch = await batchService.findById(req.params.batchId);
  if (!batch) {
    return res.status(404).json({ success: false, error: 'Batch not found' });
  }

  const infractions = await infractionService.findByBatchId(batch.id);
  res.json({ success: true, data: infractions });
});

infractionsRouter.get('/infractions/:id', async (req, res) => {
  const infraction = await infractionService.findById(req.params.id);

  if (!infraction) {
    return res.status(404).json({ success: false, error: 'Infraction not found' });
  }

  res.json({ success: true, data: infraction });
});

infractionsRouter.delete('/infractions/:id', async (req, res) => {
  const deleted = await infractionService.delete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Infraction not found' });
  }

  res.status(204).send();
});

infractionsRouter.post('/batches/:batchId/import', upload.single('csv'), async (req, res, next) => {
  try {
    const batch = await batchService.findById(req.params.batchId);
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'CSV file required' });
    }

    const csvContent = req.file.buffer.toString('utf-8');
    const inputs = parseCSVInfractions(csvContent, batch.id);
    const infractions = await infractionService.createMany(inputs);

    res.status(201).json({
      success: true,
      data: {
        imported: infractions.length,
        infractions
      }
    });
  } catch (error) {
    next(error);
  }
});

