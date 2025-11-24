import crypto from 'crypto';

import { infractionStore } from './infractionStore.js';
import type { CreateInfractionInput, Infraction } from './types.js';

export const infractionService = {
  async create(input: CreateInfractionInput): Promise<Infraction> {
    const infraction: Infraction = {
      id: crypto.randomUUID(),
      batchId: input.batchId,
      unit: input.unit,
      reportedDate: new Date(input.reportedDate),
      bylawReference: input.bylawReference,
      summary: input.summary,
      recommendedAction: input.recommendedAction,
      status: 'open',
      createdAt: new Date()
    };

    return infractionStore.save(infraction);
  },

  async findById(id: string): Promise<Infraction | null> {
    return infractionStore.findById(id) ?? null;
  },

  async findByBatchId(batchId: string): Promise<Infraction[]> {
    return infractionStore.findByBatchId(batchId);
  },

  async delete(id: string): Promise<boolean> {
    return infractionStore.delete(id);
  },

  async createMany(inputs: CreateInfractionInput[]): Promise<Infraction[]> {
    return Promise.all(inputs.map((input) => this.create(input)));
  }
};

