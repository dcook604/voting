import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { apiClient } from '../api/client';

export const CreateBatch = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    votingMode: 'tracked' as 'tracked' | 'anonymized' | 'blind',
    deadline: ''
  });

  const createMutation = useMutation({
    mutationFn: () =>
      apiClient.createBatch({
        ...formData,
        createdBy: localStorage.getItem('user_email') || 'admin@example.com',
        deadline: formData.deadline || undefined
      }),
    onSuccess: (batch) => {
      navigate(`/batches/${batch.id}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <section>
      <h1>Create New Batch</h1>
      <form onSubmit={handleSubmit} className="batch-form">
        <div>
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="votingMode">Voting Mode</label>
          <select
            id="votingMode"
            value={formData.votingMode}
            onChange={(e) =>
              setFormData({ ...formData, votingMode: e.target.value as typeof formData.votingMode })
            }
          >
            <option value="tracked">Tracked</option>
            <option value="anonymized">Anonymized</option>
            <option value="blind">Blind</option>
          </select>
        </div>
        <div>
          <label htmlFor="deadline">Deadline</label>
          <input
            id="deadline"
            type="datetime-local"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create Batch'}
          </button>
          <button type="button" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};

