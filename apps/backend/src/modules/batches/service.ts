import crypto from 'crypto';

import { batchStore } from './batchStore.js';
import type { Batch, CreateBatchInput, UpdateBatchInput, VotingMode } from './types.js';

export const batchService = {
  async create(input: CreateBatchInput): Promise<Batch> {
    const batch: Batch = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description ?? '',
      createdBy: input.createdBy,
      votingMode: input.votingMode ?? 'tracked',
      deadline: input.deadline ? new Date(input.deadline) : null,
      finalized: false,
      createdAt: new Date()
    };

    return batchStore.save(batch);
  },

  async findById(id: string): Promise<Batch | null> {
    return batchStore.findById(id) ?? null;
  },

  async findAll(): Promise<Batch[]> {
    return batchStore.findAll();
  },

  async update(id: string, input: UpdateBatchInput): Promise<Batch | null> {
    const batch = batchStore.findById(id);
    if (!batch) {
      return null;
    }

    const updated: Batch = {
      ...batch,
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.votingMode !== undefined && { votingMode: input.votingMode as VotingMode }),
      ...(input.deadline !== undefined && {
        deadline: input.deadline ? new Date(input.deadline) : null
      }),
      ...(input.finalized !== undefined && { finalized: input.finalized })
    };

    return batchStore.save(updated);
  },

  async delete(id: string): Promise<boolean> {
    return batchStore.delete(id);
  }
};

