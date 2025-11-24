import crypto from 'crypto';
import { nanoid } from 'nanoid';

import { invitationStore } from './invitationStore.js';
import type { Invitation, InvitationRole } from './types.js';

const INVITATION_TTL_MINUTES = 60 * 24; // 24h by default

const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

export const invitationService = {
  async createInvitation(email: string, role: InvitationRole) {
    const token = nanoid(32);
    const now = new Date();
    const invitation: Invitation = {
      id: crypto.randomUUID(),
      email,
      role,
      tokenHash: hashToken(token),
      expiresAt: new Date(now.getTime() + INVITATION_TTL_MINUTES * 60 * 1000),
      sentAt: now
    };

    invitationStore.save(invitation);

    return { invitation, token };
  },

  async consumeToken(token: string) {
    const tokenHash = hashToken(token);
    const invitation = invitationStore.findByTokenHash(tokenHash);

    if (!invitation) {
      return null;
    }

    if (invitation.expiresAt.getTime() < Date.now()) {
      return null;
    }

    invitation.acceptedAt = new Date();
    invitationStore.save(invitation);

    return invitation;
  }
};
