// restore.js
import 'dotenv/config';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const DATABASE_URL = process.env.DATABASE_URL;
const RESTORE_FOLDER_PATH = process.env.RESTORE_FOLDER_PATH;
const TYPE = process.env.TYPE;


// Validasi env
if (TYPE === 'PRODUCTION') {
  console.error('Cannot restore to production database. PROHIBITED!');
  process.exit(1);
}

// Validasi env
if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set in .env');
  process.exit(1);
}
if (!RESTORE_FOLDER_PATH) {
  console.error('RESTORE_FOLDER_PATH is not set in .env');
  process.exit(1);
}

// Ambil argumen folder backup dari CLI: node restore.js 2026-03-02T09-05-20-953Z
const targetBackup = process.argv[2];

if (!targetBackup) {
  console.log('Available backups:\n');
  const backups = fs.readdirSync(`./${RESTORE_FOLDER_PATH}`).sort().reverse();

  if (backups.length === 0) {
    console.error('No backups found in', RESTORE_FOLDER_PATH);
    process.exit(1);
  }

  backups.forEach((b, i) => console.log(`  [${i}] ${b}`));
  console.log('\nUsage: node restore.js <backup-folder-name>');
  console.log('Example: node restore.js', backups[0]);
  process.exit(0);
}

const dir = `./${RESTORE_FOLDER_PATH}/${targetBackup}`;

// Validasi folder backup ada
if (!fs.existsSync(dir)) {
  console.error(`Backup folder not found: ${dir}`);
  process.exit(1);
}

const rolesFile  = path.join(dir, 'roles.sql');
const schemaFile = path.join(dir, 'schema.sql');
const dataFile   = path.join(dir, 'data.sql');

console.log(`\nRestoring from: ${dir}\n`);

// Clean dulu sebelum restore
console.log('Cleaning database before restore...');
execSync(
  `psql "${DATABASE_URL}" --no-psqlrc -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"`,
  { stdio: 'inherit' }
);
console.log('Database cleaned\n');

// Restore roles dulu, lalu schema, lalu data — urutan penting!
const steps = [
  { file: rolesFile,  label: 'roles'  },
  { file: schemaFile, label: 'schema' },
  { file: dataFile,   label: 'data'   },
];

for (const step of steps) {
  if (!fs.existsSync(step.file)) {
    console.warn(`Skipping ${step.label} — file not found: ${step.file}`);
    continue;
  }

  console.log(`Restoring ${step.label}...`);
  execSync(
    `psql "${DATABASE_URL}" -f "${step.file}"`,
    { stdio: 'inherit' }
  );
  console.log(`${step.label} restored\n`);
}

console.log('Restore complete!');
