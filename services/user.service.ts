import { FieldPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../db';

export const getUserById = (id: number) => {
  return pool.query(
    'SELECT id, first_name, last_name, email FROM users WHERE id = ?',
    [id]
  ) as Promise<[ResultSetHeader, FieldPacket[]]>
}

export const getUserByEmail = (email: string) => {
  return pool.query(
    'SELECT id, first_name, last_name, email, password FROM users WHERE email = ?',
    [email]
  )
}