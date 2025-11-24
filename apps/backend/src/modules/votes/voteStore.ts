import type { VoteRecord } from './types.js';

class VoteStore {
  private votes: VoteRecord[] = [];

  add(vote: VoteRecord) {
    this.votes.push(vote);
    return vote;
  }

  listByInfraction(infractionId: string) {
    return this.votes.filter((vote) => vote.infractionId === infractionId);
  }

  listByUser(userId: string) {
    return this.votes.filter((vote) => vote.userId === userId);
  }

  getLastHash() {
    return this.votes.length ? this.votes[this.votes.length - 1].hash : null;
  }
}

export const voteStore = new VoteStore();
