import { Invitation } from './types.js';

class InvitationStore {
  private invitations = new Map<string, Invitation>();

  save(invitation: Invitation) {
    this.invitations.set(invitation.id, invitation);
    return invitation;
  }

  findByTokenHash(tokenHash: string) {
    for (const invitation of this.invitations.values()) {
      if (invitation.tokenHash === tokenHash) {
        return invitation;
      }
    }

    return undefined;
  }
}

export const invitationStore = new InvitationStore();
