export type AuditLogEntry = {
  id: string;
  actorId: string;
  action: string;
  objectType: string;
  objectId: string;
  details: Record<string, unknown>;
  createdAt: Date;
};
