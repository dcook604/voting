import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { apiClient } from '../api/client';
import { useSession } from '../store/useSession';

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { setRole } = useSession();
  const [email, setEmail] = useState('');

  const { setEmail } = useSession();
  const exchangeMutation = useMutation({
    mutationFn: (token: string) => apiClient.exchangeToken(token),
    onSuccess: (data) => {
      setRole(data.user.role as 'admin' | 'council' | 'observer');
      setEmail(data.user.email);
      navigate('/');
    }
  });

  const requestLinkMutation = useMutation({
    mutationFn: () => apiClient.requestMagicLink(email, 'council'),
    onSuccess: () => {
      alert('Magic link sent! Check your email.');
    }
  });

  if (token) {
    exchangeMutation.mutate(token);
    return <p>Logging in...</p>;
  }

  return (
    <section className="login-page">
      <h1>Strata Remote Voting</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          requestLinkMutation.mutate();
        }}
      >
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <button type="submit" disabled={requestLinkMutation.isPending}>
          {requestLinkMutation.isPending ? 'Sending...' : 'Request Magic Link'}
        </button>
      </form>
    </section>
  );
};

