import jwt from 'jsonwebtoken';

import { config } from '../../config.js';

export type AuthTokenPayload = {
  sub: string;
  role: string;
};

export const signAuthToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: '15m' });
