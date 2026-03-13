// backup.js
import 'dotenv/config';
import { execSync } from 'child_process';
import fs from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;
const BACKUP_FOLDER_PATH = process.env.BACKUP_FOLDER_PATH;


// Validasi env sebelum lanjut
if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set in .env');
  process.exit(1);
}
if (!BACKUP_FOLDER_PATH) {
  console.error('BACKUP_FOLDER_PATH is not set in .env');
  process.exit(1);
}
console.log('Starting backup process...');
console.log(`Database URL: ${DATABASE_URL}`);
console.log(`Backup folder: ${BACKUP_FOLDER_PATH}`);



const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const dir = `./${BACKUP_FOLDER_PATH}/${timestamp}`;

fs.mkdirSync(dir, { recursive: true });

const commands = [
  `npx supabase db dump --db-url "${DATABASE_URL}" -f ${dir}/roles.sql --role-only`,
  `npx supabase db dump --db-url "${DATABASE_URL}" -f ${dir}/schema.sql`,
  `npx supabase db dump --db-url "${DATABASE_URL}" -f ${dir}/data.sql --data-only`,
];

commands.forEach(cmd => {
  console.log(`Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
});

console.log(`Backup saved to ${dir}`);
