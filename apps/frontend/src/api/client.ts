import { config } from '../config';
import type { Batch, BatchDetail, Infraction, VoteValue } from '../types';

type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

const getAuthToken = () => localStorage.getItem('auth_token');

const fetchApi = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const res = await fetch(`${config.apiBaseUrl}${path}`, {
    ...options,
    headers,
    credentials: 'include'
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  const body = (await res.json()) as ApiResponse<T>;
  if (!body.success) {
    throw new Error(body.error);
  }

  return body.data;
};

export const apiClient = {
  async listBatches(): Promise<Batch[]> {
    const batches = await fetchApi<Batch[]>('/batches');
    return batches.map((batch) => ({
      ...batch,
      deadline: batch.deadline ? new Date(batch.deadline) : null,
      createdAt: new Date(batch.createdAt)
    }));
  },

  async getBatch(id: string): Promise<BatchDetail> {
    const data = await fetchApi<BatchDetail>(`/batches/${id}`);
    return {
      ...data,
      deadline: data.deadline ? new Date(data.deadline) : null,
      createdAt: new Date(data.createdAt),
      infractions: data.infractions.map((inf) => ({
        ...inf,
        reportedDate: new Date(inf.reportedDate),
        createdAt: new Date(inf.createdAt)
      }))
    };
  },

  async createBatch(input: {
    title: string;
    description?: string;
    createdBy: string;
    votingMode?: 'tracked' | 'anonymized' | 'blind';
    deadline?: string;
  }): Promise<Batch> {
    return fetchApi<Batch>('/batches', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  },

  async updateBatch(id: string, input: {
    title?: string;
    description?: string;
    votingMode?: 'tracked' | 'anonymized' | 'blind';
    deadline?: string | null;
    finalized?: boolean;
  }): Promise<Batch> {
    return fetchApi<Batch>(`/batches/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input)
    });
  },

  async createInfraction(batchId: string, input: {
    unit: string;
    reportedDate: string;
    bylawReference: string;
    summary: string;
    recommendedAction: string;
  }): Promise<Infraction> {
    return fetchApi<Infraction>(`/batches/${batchId}/infractions`, {
      method: 'POST',
      body: JSON.stringify(input)
    });
  },

  async castVote(infractionId: string, userId: string, vote: VoteValue) {
    return fetchApi<{ id: string; voteValue: VoteValue; hash: string }>(
      `/infractions/${infractionId}/vote`,
      {
        method: 'POST',
        body: JSON.stringify({ userId, vote })
      }
    );
  },

  async getVoteResults(infractionId: string) {
    return fetchApi<{
      summary: { yes: number; no: number; abstain: number; total: number };
      latestVotes: Array<{ id: string; voteValue: VoteValue; userId: string }>;
    }>(`/infractions/${infractionId}/results`);
  },

  async getUserVotes(userId: string) {
    return fetchApi<Array<{ id: string; infractionId: string; voteValue: VoteValue }>>(
      `/users/${userId}/votes`
    );
  },

  async exchangeToken(token: string) {
    const data = await fetchApi<{ token: string; user: { email: string; role: string } }>(
      '/auth/token',
      {
        method: 'POST',
        body: JSON.stringify({ token })
      }
    );
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_email', data.user.email);
    localStorage.setItem('user_role', data.user.role);
    return data;
  },

  async requestMagicLink(email: string, role: 'admin' | 'council' | 'observer' = 'council') {
    return fetchApi<{ invitationId: string; expiresAt: string; token: string }>(
      '/auth/magic-link',
      {
        method: 'POST',
        body: JSON.stringify({ email, role })
      }
    );
  }
};
