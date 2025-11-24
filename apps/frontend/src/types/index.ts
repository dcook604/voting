export type VotingMode = 'tracked' | 'anonymized' | 'blind';

export type VoteValue = 'yes' | 'no' | 'abstain';

export type Batch = {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  votingMode: VotingMode;
  deadline: string | null;
  finalized: boolean;
  createdAt: string;
};

export type Infraction = {
  id: string;
  batchId: string;
  unit: string;
  reportedDate: string;
  bylawReference: string;
  summary: string;
  recommendedAction: string;
  status: 'open' | 'voted' | 'closed';
  createdAt: string;
};

export type BatchDetail = Batch & {
  infractions: Infraction[];
};
