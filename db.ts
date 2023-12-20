import { createPool } from 'mysql2/promise';

export const pool = createPool({
  host: 'localhost',
  user: 'davejs',
  password: 'Davejs-21',
  database: 'DELIVERY',
})
