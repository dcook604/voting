# Database Structure

Primary database: MariaDB (compatible with PostgreSQL) managed via Prisma/Knex (TBD). Use UUIDs for public-facing IDs, hash tokens, and enforce RBAC constraints.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(254) UNIQUE NOT NULL,
  name VARCHAR(200),
  role VARCHAR(20) NOT NULL DEFAULT 'council', -- admin|council|observer
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE batches (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_by INT REFERENCES users(id),
  voting_mode VARCHAR(20) DEFAULT 'tracked', -- tracked|anonymized|blind
  deadline TIMESTAMP,
  finalized BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE infractions (
  id SERIAL PRIMARY KEY,
  batch_id INT REFERENCES batches(id) ON DELETE CASCADE,
  unit VARCHAR(50),
  reported_date DATE,
  bylaw_reference VARCHAR(200),
  summary TEXT,
  recommended_action TEXT,
  status VARCHAR(20) DEFAULT 'open', -- open|voted|closed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attachments (
  id SERIAL PRIMARY KEY,
  infraction_id INT REFERENCES infractions(id) ON DELETE CASCADE,
  filename VARCHAR(255),
  storage_path TEXT,
  mime VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  infraction_id INT REFERENCES infractions(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id),
  vote_value VARCHAR(10), -- yes|no|abstain
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  token_hash VARCHAR(255)
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  actor_id INT,
  action VARCHAR(100),
  object_type VARCHAR(50),
  object_id INT,
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invitations (
  id SERIAL PRIMARY KEY,
  batch_id INT REFERENCES batches(id) ON DELETE CASCADE,
  email VARCHAR(254),
  invite_token VARCHAR(255),
  sent_at TIMESTAMP,
  accepted_at TIMESTAMP
);
```

## Notes
- Hash invite tokens + magic links; do not store raw values.
- Consider `votes.hash_chain` column for tamper evidence.
- Add indexes on foreign keys, `votes.user_id`, `infractions.batch_id`, `audit_logs.created_at`.
- Attachments stored via MinIO/S3 with metadata referencing sanitized filenames.
- `details` JSON should capture before/after when applicable.
