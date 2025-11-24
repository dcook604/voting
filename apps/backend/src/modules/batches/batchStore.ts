import type { Batch } from './types.js';

class BatchStore {
  private batches = new Map<string, Batch>();

  save(batch: Batch) {
    this.batches.set(batch.id, batch);
    return batch;
  }

  findById(id: string) {
    return this.batches.get(id);
  }

  findAll() {
    return Array.from(this.batches.values());
  }

  delete(id: string) {
    return this.batches.delete(id);
  }
}

export const batchStore = new BatchStore();

