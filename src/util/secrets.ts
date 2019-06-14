import dotenv from 'dotenv';
import logger from './logger';

dotenv.config({ path: '.env' });

export const MONGODB_URI = process.env['MONGODB_URI'];

if (!MONGODB_URI) {
    logger.error('No mongo connection string. Set MONGODB_URI environment variable.');
    process.exit(1);
}