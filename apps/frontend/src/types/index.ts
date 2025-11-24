export type VotingMode = 'tracked' | 'anonymized' | 'blind';

export type VoteValue = 'yes' | 'no' | 'abstain';

export type Batch = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  votingMode: VotingMode;
  totalInfractions: number;
  remainingInfractions: number;
  finalized: boolean;
};

export type Infraction = {
  id: string;
  unit: string;
  summary: string;
  bylawReference: string;
  recommendedAction: string;
  reportedDate: string;
  attachments: Array<{ id: string; filename: string }>;
};

export type BatchDetail = Batch & {
  infractions: Infraction[];
};
