import { parse } from 'csv-parse/sync';

import type { CreateInfractionInput, CSVInfractionRow } from './types.js';

export const parseCSVInfractions = (csvContent: string, batchId: string): CreateInfractionInput[] => {
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as CSVInfractionRow[];

  return records.map((row) => ({
    batchId,
    unit: row.unit,
    reportedDate: row.reported_date,
    bylawReference: row.bylaw_reference,
    summary: row.summary,
    recommendedAction: row.recommended_action
  }));
};

