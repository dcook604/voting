# Deployment Guide for Coolify

This guide covers deploying the Strata Remote Voting App on a VPS using Coolify.

## Prerequisites

- Coolify installed on your VPS
- Domain name (optional, for HTTPS)
- SMTP server credentials (for email notifications)

## Quick Start with Coolify

### Option 1: Docker Compose (Recommended)

1. **Clone the repository** to your VPS or connect it to Coolify via Git.

2. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables** in `.env`:
   - Set `DB_ROOT_PASSWORD` and `DB_PASSWORD` to secure values
   - Set `JWT_SECRET` to a long random string (use `openssl rand -hex 32`)
   - Configure SMTP settings for email notifications
   - Set `APP_BASE_URL` to your domain (e.g., `https://voting.yourdomain.com`)

4. **In Coolify**:
   - Create a new resource
   - Select "Docker Compose"
   - Point to your repository
   - Coolify will automatically detect `docker-compose.yml`
   - Set environment variables in Coolify's UI (or use `.env` file)

5. **Database Migration**:
   - The backend will automatically run migrations on startup
   - First run may take a moment to initialize the database

### Option 2: Individual Services

If you prefer to deploy services separately in Coolify:

#### Backend Service

1. **Create a new resource** → "Docker Compose" or "Dockerfile"
2. **Build context**: `./apps/backend`
3. **Dockerfile**: `apps/backend/Dockerfile`
4. **Environment variables**:
   ```
   DATABASE_URL=mysql://voting:password@db:3306/voting
   JWT_SECRET=your-secret-here
   SMTP_HOST=your-smtp-host
   SMTP_PORT=587
   SMTP_USER=your-smtp-user
   SMTP_PASSWORD=your-smtp-password
   SMTP_FROM="Strata Voting <noreply@yourdomain.com>"
   APP_BASE_URL=https://yourdomain.com
   ```
5. **Volumes**: Mount `/app/uploads` for file storage
6. **Port**: 4000

#### Frontend Service

1. **Create a new resource** → "Dockerfile"
2. **Build context**: `./apps/frontend`
3. **Dockerfile**: `apps/frontend/Dockerfile`
4. **Environment variables**:
   ```
   VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
   ```
5. **Port**: 80 (or let Coolify handle it)

#### Database Service

1. **Create a new resource** → "Database" → "MariaDB"
2. **Database name**: `voting`
3. **User**: `voting`
4. **Password**: Set a secure password
5. **Link to backend service**

## Environment Variables Reference

### Backend

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | MySQL connection string | Yes | - |
| `JWT_SECRET` | Secret for JWT signing | Yes | - |
| `SMTP_HOST` | SMTP server hostname | Yes | - |
| `SMTP_PORT` | SMTP server port | No | 587 |
| `SMTP_USER` | SMTP username | Yes | - |
| `SMTP_PASSWORD` | SMTP password | Yes | - |
| `SMTP_FROM` | From address for emails | No | `Strata Voting <noreply@example.com>` |
| `APP_BASE_URL` | Base URL for magic links | Yes | - |
| `PORT` | Backend port | No | 4000 |

### Frontend

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_BASE_URL` | Backend API URL | Yes | - |

## Database Setup

The application uses Prisma for database management. On first startup, migrations run automatically.

To manually run migrations:
```bash
cd apps/backend
npx prisma migrate deploy
```

## File Storage

Attachments are stored locally in `/app/uploads` inside the backend container. This directory is persisted via Docker volumes.

**Important**: For production, ensure the uploads volume is backed up regularly.

## Email Configuration

The app requires SMTP access for:
- Magic link invitations
- Finalization notifications

Configure your SMTP settings in environment variables. The app works with any SMTP provider (Gmail, SendGrid, Mailgun, etc.).

## Security Checklist

- [ ] Change all default passwords
- [ ] Set a strong `JWT_SECRET` (32+ characters)
- [ ] Use HTTPS (Coolify handles this automatically)
- [ ] Configure SMTP with secure credentials
- [ ] Set up regular database backups
- [ ] Restrict database access to backend service only

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` format: `mysql://user:password@host:port/database`
- Check database service is healthy before backend starts
- Review database logs in Coolify

### Migration Errors

- Ensure database user has CREATE/DROP permissions
- Check Prisma schema matches database structure
- Review backend logs for migration errors

### File Upload Issues

- Verify uploads volume is mounted correctly
- Check file permissions on uploads directory
- Review backend logs for storage errors

### Email Not Sending

- Verify SMTP credentials are correct
- Check SMTP port (587 for TLS, 465 for SSL)
- Review backend logs for email errors
- Test SMTP connection independently

## Backup Strategy

1. **Database**: Use Coolify's built-in backup or set up cron job:
   ```bash
   mysqldump -u voting -p voting > backup.sql
   ```

2. **Uploads**: Backup the uploads volume:
   ```bash
   docker run --rm -v voting_uploads-data:/data -v $(pwd):/backup alpine tar czf /backup/uploads-backup.tar.gz /data
   ```

## Updates

To update the application:

1. Pull latest code
2. Rebuild services in Coolify
3. Migrations run automatically on backend startup
4. No downtime if using Coolify's zero-downtime deployment

## Support

For issues or questions, check:
- Application logs in Coolify
- Database logs
- Backend console output


