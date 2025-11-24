import crypto from 'crypto';

import { auditStore } from './auditStore.js';
import type { AuditLogEntry } from './types.js';

export const auditService = {
  async log(entry: Omit<AuditLogEntry, 'id' | 'createdAt'>) {
    const record: AuditLogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };

    return auditStore.add(record);
  },

  async list(limit?: number) {
    return auditStore.list(limit);
  }
};
