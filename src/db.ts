import { Pool } from 'pg';

const pool = new Pool({
  user: 'user',
  host: 'db',
  database: 'crm_db',
  password: 'password',
  port: 5432,
});

export default pool;
