import type { Batch } from '../batches/types.js';
import type { Infraction } from '../infractions/types.js';
import type { VoteRecord } from '../votes/types.js';

type ExportData = {
  batch: Batch;
  infractions: Infraction[];
  votes: VoteRecord[];
};

export const generateCSV = (data: ExportData): string => {
  const lines: string[] = [];
  
  lines.push('Batch Export');
  lines.push(`Title,${data.batch.title}`);
  lines.push(`Description,${data.batch.description}`);
  lines.push(`Voting Mode,${data.batch.votingMode}`);
  lines.push(`Deadline,${data.batch.deadline?.toISOString() ?? 'N/A'}`);
  lines.push(`Finalized,${data.batch.finalized}`);
  lines.push(`Created At,${data.batch.createdAt.toISOString()}`);
  lines.push('');
  lines.push('Infractions');
  lines.push('Unit,Reported Date,Bylaw Reference,Summary,Recommended Action,Yes Votes,No Votes,Abstain Votes,Total Votes');
  
  const voteMap = new Map<string, { yes: number; no: number; abstain: number; total: number }>();
  
  data.votes.forEach((vote) => {
    if (!voteMap.has(vote.infractionId)) {
      voteMap.set(vote.infractionId, { yes: 0, no: 0, abstain: 0, total: 0 });
    }
    const counts = voteMap.get(vote.infractionId)!;
    counts[vote.voteValue] += 1;
    counts.total += 1;
  });
  
  data.infractions.forEach((infraction) => {
    const counts = voteMap.get(infraction.id) ?? { yes: 0, no: 0, abstain: 0, total: 0 };
    lines.push(
      [
        infraction.unit,
        infraction.reportedDate.toISOString().split('T')[0],
        infraction.bylawReference,
        `"${infraction.summary.replace(/"/g, '""')}"`,
        `"${infraction.recommendedAction.replace(/"/g, '""')}"`,
        counts.yes,
        counts.no,
        counts.abstain,
        counts.total
      ].join(',')
    );
  });
  
  return lines.join('\n');
};

