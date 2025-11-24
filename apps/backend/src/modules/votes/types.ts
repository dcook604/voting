export type VoteValue = 'yes' | 'no' | 'abstain';

export type VoteRecord = {
  id: string;
  infractionId: string;
  userId: string;
  voteValue: VoteValue;
  createdAt: Date;
  previousHash: string | null;
  hash: string;
};
