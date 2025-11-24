import { Router } from 'express';
import multer from 'multer';

import { infractionService } from '../modules/infractions/service.js';
import { localStorage } from '../modules/storage/localStorage.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

export const attachmentsRouter = Router();

attachmentsRouter.post('/infractions/:id/attachments', upload.single('file'), async (req, res, next) => {
  try {
    const infraction = await infractionService.findById(req.params.id);
    if (!infraction) {
      return res.status(404).json({ success: false, error: 'Infraction not found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'File required' });
    }

    const filename = await localStorage.saveFile(req.file);

    res.status(201).json({
      success: true,
      data: {
        id: filename,
        filename: req.file.originalname,
        mime: req.file.mimetype,
        storagePath: filename
      }
    });
  } catch (error) {
    next(error);
  }
});

attachmentsRouter.get('/attachments/:id', async (req, res) => {
  const file = await localStorage.getFile(req.params.id);

  if (!file) {
    return res.status(404).json({ success: false, error: 'File not found' });
  }

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${req.params.id}"`);
  res.send(file);
});


