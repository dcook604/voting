import crypto from 'crypto';

import { voteStore } from './voteStore.js';
import type { VoteRecord, VoteValue } from './types.js';

const hashVote = (payload: { previousHash: string | null; infractionId: string; userId: string; voteValue: VoteValue; timestamp: string }) => {
  const data = `${payload.previousHash ?? ''}|${payload.infractionId}|${payload.userId}|${payload.voteValue}|${payload.timestamp}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

const latestVoteByUser = (votes: VoteRecord[], userId: string) => {
  return votes
    .filter((vote) => vote.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
};

export const voteService = {
  async castVote(input: { infractionId: string; userId: string; voteValue: VoteValue }) {
    const timestamp = new Date();
    const previousHash = voteStore.getLastHash();
    const hash = hashVote({
      previousHash,
      infractionId: input.infractionId,
      userId: input.userId,
      voteValue: input.voteValue,
      timestamp: timestamp.toISOString()
    });

    const vote: VoteRecord = {
      id: crypto.randomUUID(),
      infractionId: input.infractionId,
      userId: input.userId,
      voteValue: input.voteValue,
      createdAt: timestamp,
      previousHash,
      hash
    };

    return voteStore.add(vote);
  },

  async getResults(infractionId: string) {
    const votes = voteStore.listByInfraction(infractionId);
    const latestByUser = new Map<string, VoteRecord>();

    votes.forEach((vote) => {
      const current = latestByUser.get(vote.userId);
      if (!current || vote.createdAt > current.createdAt) {
        latestByUser.set(vote.userId, vote);
      }
    });

    const summary = {
      yes: 0,
      no: 0,
      abstain: 0,
      total: latestByUser.size
    };

    Array.from(latestByUser.values()).forEach((vote) => {
      summary[vote.voteValue] += 1;
    });

    return {
      summary,
      latestVotes: Array.from(latestByUser.values())
    };
  },

  async getUserVotes(userId: string) {
    const votes = voteStore.listByUser(userId);

    return votes.reduce<Record<string, VoteRecord>>((acc, vote) => {
      const existing = acc[vote.infractionId];
      if (!existing || vote.createdAt > existing.createdAt) {
        acc[vote.infractionId] = vote;
      }
      return acc;
    }, {});
  }
};
