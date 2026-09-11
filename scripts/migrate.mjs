import 'dotenv/config';import fs from 'node:fs';import postgres from 'postgres';
if(!process.env.DATABASE_URL)throw Error('Set DATABASE_URL before running migrations.');
const sql=postgres(process.env.DATABASE_URL);await sql.unsafe(fs.readFileSync('migrations/001_initial.sql','utf8'));await sql.end();console.log('Migration complete.');
