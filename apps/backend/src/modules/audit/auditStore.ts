import type { AuditLogEntry } from './types.js';

class AuditStore {
  private entries: AuditLogEntry[] = [];

  add(entry: AuditLogEntry) {
    this.entries.push(entry);
    return entry;
  }

  list(limit = 100) {
    return this.entries.slice(-limit).reverse();
  }
}

export const auditStore = new AuditStore();
