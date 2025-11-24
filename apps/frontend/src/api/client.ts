import { config } from '../config';
import { mockBatches } from '../data/mock';
import type { Batch, BatchDetail } from '../types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

const fetchJson = async <T>(path: string, fallback: () => Promise<T>): Promise<T> => {
  if (import.meta.env.DEV) {
    return fallback();
  }

  try {
    const res = await fetch(`${config.apiBaseUrl}${path}`, { credentials: 'include' });
    if (!res.ok) {
      throw new Error('Request failed');
    }

    const body = (await res.json()) as ApiResponse<T>;
    if (!body.success) {
      throw new Error(body.error);
    }

    return body.data;
  } catch (error) {
    console.warn('Falling back to mock data', error);
    return fallback();
  }
};

export const apiClient = {
  async listBatches(): Promise<Batch[]> {
    return fetchJson('/batches', async () => {
      await delay(150);
      return mockBatches.map(({ infractions, ...batch }) => ({
        ...batch,
        remainingInfractions: batch.remainingInfractions
      }));
    });
  },
  async getBatch(id: string): Promise<BatchDetail | undefined> {
    return fetchJson(`/batches/${id}`, async () => {
      await delay(150);
      return mockBatches.find((batch) => batch.id === id);
    });
  }
};
