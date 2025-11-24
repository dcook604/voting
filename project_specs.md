# Strata Remote Voting App — System Design

## Summary / Goals
- Secure, self-hosted workflow for council members to review infractions and vote remotely.
- Maintain auditable, tamper-evident vote records supporting tracked, anonymized, and blind modes.
- Support batch import/export, evidence attachments, and exportable reports (CSV/PDF).
- Deploy via Docker on existing VPS/Coolify-like platforms.

## Personas & Roles
- **Council Member**: review assigned infractions, vote, view own history.
- **Admin (Strata Manager/Chair)**: manage infractions, members, deadlines, exports.
- **Observer (optional)**: read-only access to finalized results.
- Permissions matrix summarized in rules section (Admin CRUD/export, Member vote, Observer read-only post-finalization).

## Core Features
- CSV batch import with template + manual additions.
- Per-infraction detail page with evidence and recommendation.
- One-click Yes/No/Abstain voting with deadline enforcement.
- Voting modes (tracked/anonymized/blind) plus notifications, audit logging, exports, search/filter, and invite-only access.

## UX Flows
- **Admin**: create batch → upload CSV/add infractions → configure settings → upload attachments → send invites → monitor votes → finalize/export.
- **Council member**: authenticate → view dashboard → drill into infractions → vote/change until deadline → view results post-finalization.

## Data Model
Tables: `users`, `batches`, `infractions`, `attachments`, `votes`, `audit_logs`, `invitations`. See `db_structure.md` for DDL and notes.

## API Design (REST)
Base `/api/v1`. Includes auth (magic link/token/password), batch management, infraction endpoints, voting endpoints, attachments, and exports. Responses follow `{ success, data, error }`.

## Authentication & Security
Magic-link, password+2FA, or SSO; enforce HTTPS, rate limiting, JWTs, RBAC, signed attachment URLs, token hashing, tamper-evident vote chaining, signed PDFs.

## File Storage & Evidence Handling
Options: Docker volume, MinIO, or external S3; require access control, optional virus scan, thumbnails/previews.

## Notifications & Email Flows
Use Mailu SMTP; flows for invites, reminders, finalization summaries with relevant metadata.

## Audit, Logging & Compliance
Persist audit logs, immutable export snapshots, retention policy, admin-only mapping for anonymized mode.

## Admin Tools & Imports
CSV template fields listed; features include bulk attach upload, import preview, undo last import.

## Deployment Architecture & Docker Compose
Services: backend (Node/Express), frontend (React SPA), MariaDB/Postgres, MinIO, Mail integration, reverse proxy. See `docker-compose.yml` for skeleton.

## Integrations
- **EspoCRM**: push finalize events/reports via API.
- **ListMonk**: optional templated emails.
- **Mailu**: SMTP relay for transactional mail.

## Testing & Acceptance Criteria
- Handle ≥100 infractions per batch with correct tallies.
- Votes immutable after finalization.
- CSV import error reporting.
- Exports include timestamp + finalizing admin.
- Access restricted to invited emails per batch.

## Privacy & Legal Considerations
- Store minimal PII, support retention policies, secure evidence, align with strata bylaws and local privacy law.

## Next Steps & Deliverables Checklist
1. Implement backend auth + vote APIs (magic link baseline).
2. Build frontend dashboard + voting flows.
3. Wire CSV import/export flows and audit logging.
4. Integrate email notifications and storage backend.
5. Validate against testing criteria and document deployment runbooks.
