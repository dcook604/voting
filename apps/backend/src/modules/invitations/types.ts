export type InvitationRole = 'admin' | 'council' | 'observer';

export type Invitation = {
  id: string;
  email: string;
  role: InvitationRole;
  tokenHash: string;
  expiresAt: Date;
  sentAt: Date;
  acceptedAt?: Date;
};
