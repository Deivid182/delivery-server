import { pool } from "../db";

export const getUserById = (id: number) => {
  return pool.query(
    `
    SELECT u.id, u.email, u.firstName, u.lastName, u.image, u.phone,
    JSON_ARRAYAGG(JSON_OBJECT('id', r.id, 'name', r.name, 'image', r.image, 'route', r.route)) AS roles
    FROM users AS u
    INNER JOIN user_has_roles AS uhr ON uhr.userId = u.id
    INNER JOIN roles AS r ON uhr.roleId = r.id
    WHERE u.id = ?;
    `,
    [id]
  )
};

export const getUserByEmail = (email: string) => {
  return pool.query(
    `
    SELECT u.id, u.email, u.firstName, u.lastName, u.image, u.phone,
    JSON_ARRAYAGG(JSON_OBJECT('id', r.id, 'name', r.name, 'image', r.image, 'route', r.route)) AS roles
    FROM users AS u
    INNER JOIN user_has_roles AS uhr ON uhr.userId = u.id
    INNER JOIN roles AS r ON uhr.roleId = r.id
    WHERE u.email = ?;
    `,
    [email]
  );
};
