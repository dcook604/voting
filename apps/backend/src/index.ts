import { prisma } from './db.js';
import { logger } from './logger.js';
import { startServer } from './server.js';

const main = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connected');
    startServer();
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
};

main();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
