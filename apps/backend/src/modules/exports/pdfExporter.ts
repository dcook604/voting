import PDFDocument from 'pdfkit';

import type { Batch } from '../batches/types.js';
import type { Infraction } from '../infractions/types.js';
import type { VoteRecord } from '../votes/types.js';

type ExportData = {
  batch: Batch;
  infractions: Infraction[];
  votes: VoteRecord[];
  finalizedBy?: string;
};

export const generatePDF = async (data: ExportData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];
    
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    
    doc.fontSize(20).text('Strata Voting Report', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12);
    doc.text(`Batch: ${data.batch.title}`, { align: 'left' });
    doc.text(`Description: ${data.batch.description || 'N/A'}`);
    doc.text(`Voting Mode: ${data.batch.votingMode}`);
    doc.text(`Deadline: ${data.batch.deadline?.toISOString().split('T')[0] ?? 'N/A'}`);
    doc.text(`Finalized: ${data.batch.finalized ? 'Yes' : 'No'}`);
    if (data.finalizedBy) {
      doc.text(`Finalized By: ${data.finalizedBy}`);
    }
    doc.text(`Created: ${data.batch.createdAt.toISOString().split('T')[0]}`);
    doc.moveDown();
    
    const voteMap = new Map<string, { yes: number; no: number; abstain: number; total: number }>();
    
    data.votes.forEach((vote) => {
      if (!voteMap.has(vote.infractionId)) {
        voteMap.set(vote.infractionId, { yes: 0, no: 0, abstain: 0, total: 0 });
      }
      const counts = voteMap.get(vote.infractionId)!;
      counts[vote.voteValue] += 1;
      counts.total += 1;
    });
    
    doc.fontSize(16).text('Infractions', { underline: true });
    doc.moveDown();
    
    data.infractions.forEach((infraction, index) => {
      if (index > 0) {
        doc.moveDown(0.5);
      }
      
      const counts = voteMap.get(infraction.id) ?? { yes: 0, no: 0, abstain: 0, total: 0 };
      
      doc.fontSize(14).text(`Infraction ${index + 1}: Unit ${infraction.unit}`, { bold: true });
      doc.fontSize(10);
      doc.text(`Reported Date: ${infraction.reportedDate.toISOString().split('T')[0]}`);
      doc.text(`Bylaw Reference: ${infraction.bylawReference}`);
      doc.text(`Summary: ${infraction.summary}`);
      doc.text(`Recommended Action: ${infraction.recommendedAction}`);
      doc.text(`Votes - Yes: ${counts.yes}, No: ${counts.no}, Abstain: ${counts.abstain}, Total: ${counts.total}`);
      
      if (index < data.infractions.length - 1) {
        doc.moveDown(0.3);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      }
    });
    
    doc.end();
  });
};

