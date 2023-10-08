import { Pool } from 'pg';

export const pool = new Pool({
    user: 'ravi',
    host: '13.232.169.223',
    database: 'tradebot',
    password: 'ravi',
    port: 5432,
});
