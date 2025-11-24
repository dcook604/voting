import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../api/client';

export const useBatches = () =>
  useQuery({
    queryKey: ['batches'],
    queryFn: () => apiClient.listBatches()
  });

export const useBatchDetail = (id: string) =>
  useQuery({
    queryKey: ['batches', id],
    queryFn: () => apiClient.getBatch(id),
    enabled: Boolean(id)
  });
