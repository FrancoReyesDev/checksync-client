import dotenv from 'dotenv';
dotenv.config();

const scheme = process.env['SCHEME'] || 'http';
const host = process.env['HOST'] || 'localhost';
const port = process.env['PORT'] || '3000';

export const origin = scheme + '://' + host + ':' + port;
