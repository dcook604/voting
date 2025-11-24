import type { Infraction } from './types.js';

class InfractionStore {
  private infractions = new Map<string, Infraction>();

  save(infraction: Infraction) {
    this.infractions.set(infraction.id, infraction);
    return infraction;
  }

  findById(id: string) {
    return this.infractions.get(id);
  }

  findByBatchId(batchId: string) {
    return Array.from(this.infractions.values()).filter((i) => i.batchId === batchId);
  }

  delete(id: string) {
    return this.infractions.delete(id);
  }

  deleteByBatchId(batchId: string) {
    const toDelete = this.findByBatchId(batchId).map((i) => i.id);
    toDelete.forEach((id) => this.infractions.delete(id));
    return toDelete.length;
  }
}

export const infractionStore = new InfractionStore();

