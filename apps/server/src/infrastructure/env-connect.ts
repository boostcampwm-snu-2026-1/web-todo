import { config } from 'dotenv';

config({ path: '.env.local' });

export const DB_URI = process.env.DB_URI;
