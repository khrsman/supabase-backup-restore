# Supabase Backup & Restore

Quick scripts to backup and restore Supabase databases.

## Setup

First install dependencies:

```bash
npm install
```

You need these installed:
- Node.js 18 or later
- Docker (for backup)
- psql (for restore)

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@host:port/postgres
BACKUP_FOLDER_PATH=backup
RESTORE_FOLDER_PATH=backup
TYPE=DEVELOPMENT
```

## Backup

Run this to create a backup:

```bash
node backup.js
```

This will create a timestamped folder with your database dump.

## Restore

List available backups:

```bash
node restore.js
```

Restore from a specific backup:

```bash
node restore.js 2026-03-13T07-09-46-612Z
```

Note: This drops the entire public schema before restoring. Don't use this on production databases.

## Config Notes

**DATABASE_URL** - Your Postgres connection string

**BACKUP_FOLDER_PATH** - Where backups go (like pelayanan-dev or pelayanan-prod)

**RESTORE_FOLDER_PATH** - Where to look for backups when restoring

**TYPE** - Set to PRODUCTION to block restores (safety feature)

## Common Issues

**Docker not running**

Start Docker before running backup. Check with `docker info`.

**psql not found**

Install Postgres client tools:

```bash
sudo apt-get install postgresql-client
```
