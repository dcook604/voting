export type Infraction = {
  id: string;
  batchId: string;
  unit: string;
  reportedDate: Date;
  bylawReference: string;
  summary: string;
  recommendedAction: string;
  status: 'open' | 'voted' | 'closed';
  createdAt: Date;
};

export type CreateInfractionInput = {
  batchId: string;
  unit: string;
  reportedDate: string;
  bylawReference: string;
  summary: string;
  recommendedAction: string;
};

export type CSVInfractionRow = {
  unit: string;
  reported_date: string;
  bylaw_reference: string;
  summary: string;
  recommended_action: string;
};

