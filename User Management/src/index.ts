import path from 'path';
import dotenv from 'dotenv';

const envFilePath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envFilePath });
console.log(process.env.PGHOST);