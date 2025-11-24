import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

import { config } from '../../config.js';
import { logger } from '../../logger.js';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

const ensureUploadDir = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
};

export const localStorage = {
  async saveFile(file: { buffer: Buffer; originalname: string; mimetype: string }): Promise<string> {
    await ensureUploadDir();

    const ext = path.extname(file.originalname);
    const filename = `${crypto.randomUUID()}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    await fs.writeFile(filepath, file.buffer);

    logger.debug({ filename, filepath }, 'File saved locally');
    return filename;
  },

  async getFile(filename: string): Promise<Buffer | null> {
    const filepath = path.join(UPLOAD_DIR, filename);

    try {
      return await fs.readFile(filepath);
    } catch {
      return null;
    }
  },

  async deleteFile(filename: string): Promise<void> {
    const filepath = path.join(UPLOAD_DIR, filename);

    try {
      await fs.unlink(filepath);
    } catch (error) {
      logger.warn({ filename, error }, 'Failed to delete file');
    }
  },

  getFilePath(filename: string): string {
    return path.join(UPLOAD_DIR, filename);
  }
};


