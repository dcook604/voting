import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { config } from './config.js';
import { logger } from './logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { router } from './routes/index.js';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(pinoHttp({ logger }));

  app.use('/api/v1', router);

  app.use(errorHandler);

  return app;
};

export const startServer = () => {
  const app = createApp();
  const server = app.listen(config.port, () => {
    logger.info(`API listening on port ${config.port}`);
  });

  const shutdown = () => {
    logger.info('Shutting down server');
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  return server;
};
