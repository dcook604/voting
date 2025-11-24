import type { BatchDetail } from '../types';

export const mockBatches: BatchDetail[] = [
  {
    id: 'batch-2025-001',
    title: 'Q1 2025 Parking Violations',
    description: 'Review and vote on the 12 reported parking infractions from Q1.',
    deadline: '2025-12-01T23:59:59Z',
    votingMode: 'tracked',
    totalInfractions: 12,
    remainingInfractions: 5,
    finalized: false,
    infractions: [
      {
        id: 'inf-001',
        unit: 'PH-02',
        summary: 'Overnight parking in visitor stall for 3 nights.',
        bylawReference: 'Parking Bylaw 4.3',
        recommendedAction: 'Issue warning letter and $150 fine.',
        reportedDate: '2025-10-14',
        attachments: [
          { id: 'file-1', filename: 'photo-visitor-stall.jpg' }
        ]
      },
      {
        id: 'inf-002',
        unit: '1205',
        summary: 'Vehicle leaking oil onto garage floor.',
        bylawReference: 'Maintenance Bylaw 7.1',
        recommendedAction: 'Request proof of repair; fine if ignored.',
        reportedDate: '2025-10-20',
        attachments: []
      }
    ]
  },
  {
    id: 'batch-2025-002',
    title: 'Noise Complaints – October',
    description: 'Late-night noise issues impacting floors 8-12.',
    deadline: '2025-11-30T23:59:59Z',
    votingMode: 'anonymized',
    totalInfractions: 8,
    remainingInfractions: 8,
    finalized: false,
    infractions: []
  }
];
