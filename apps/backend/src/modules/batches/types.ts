export type VotingMode = 'tracked' | 'anonymized' | 'blind';

export type Batch = {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  votingMode: VotingMode;
  deadline: Date | null;
  finalized: boolean;
  createdAt: Date;
};

export type CreateBatchInput = {
  title: string;
  description?: string;
  createdBy: string;
  votingMode?: VotingMode;
  deadline?: string;
};

export type UpdateBatchInput = {
  title?: string;
  description?: string;
  votingMode?: VotingMode;
  deadline?: string;
  finalized?: boolean;
};

