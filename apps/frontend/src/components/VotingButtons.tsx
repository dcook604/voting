import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../api/client';
import type { VoteValue } from '../types';

type Props = {
  infractionId: string;
  userId: string;
  currentVote?: VoteValue;
  disabled?: boolean;
};

export const VotingButtons = ({ infractionId, userId, currentVote, disabled }: Props) => {
  const [selectedVote, setSelectedVote] = useState<VoteValue | undefined>(currentVote);
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: (vote: VoteValue) => apiClient.castVote(infractionId, userId, vote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['votes', userId] });
    }
  });

  const handleVote = (vote: VoteValue) => {
    if (disabled || voteMutation.isPending) return;
    setSelectedVote(vote);
    voteMutation.mutate(vote);
  };

  const isActive = (vote: VoteValue) => selectedVote === vote;

  return (
    <div className="voting-buttons">
      <button
        type="button"
        className={`vote-btn vote-yes ${isActive('yes') ? 'active' : ''}`}
        onClick={() => handleVote('yes')}
        disabled={disabled || voteMutation.isPending}
      >
        {voteMutation.isPending && selectedVote === 'yes' ? 'Voting...' : 'Yes'}
      </button>
      <button
        type="button"
        className={`vote-btn vote-no ${isActive('no') ? 'active' : ''}`}
        onClick={() => handleVote('no')}
        disabled={disabled || voteMutation.isPending}
      >
        {voteMutation.isPending && selectedVote === 'no' ? 'Voting...' : 'No'}
      </button>
      <button
        type="button"
        className={`vote-btn vote-abstain ${isActive('abstain') ? 'active' : ''}`}
        onClick={() => handleVote('abstain')}
        disabled={disabled || voteMutation.isPending}
      >
        {voteMutation.isPending && selectedVote === 'abstain' ? 'Voting...' : 'Abstain'}
      </button>
    </div>
  );
};

