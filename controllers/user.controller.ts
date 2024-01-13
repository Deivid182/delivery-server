import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { MysqlErrorKeys } from "mysql-error-keys";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import keys from "../config/keys";
import { pool } from "../db";
import { CreateUserInput, LoginInput } from "../schemas/user.schema";
import { getUserByEmail, getUserById } from "../services/user.service";

export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const [user] = (await pool.query<RowDataPacket[]>(
      `
        SELECT u.id, u.email, u.password, u.firstName, u.lastName, u.image, u.phone,
        JSON_ARRAYAGG(JSON_OBJECT('id', r.id, 'name', r.name, 'image', r.image, 'route', r.route)) AS roles
        FROM users AS u
        INNER JOIN user_has_roles AS uhr ON uhr.userId = u.id
        INNER JOIN roles AS r ON uhr.roleId = r.id
        WHERE u.email = ?;
      `,
      [email]
    )) as [RowDataPacket[], FieldPacket[]];
    if (!user.length || user[0] === undefined) {
      res.status(404).json({
        message: "Invalid credentials",
        success: false,
        data: {},
      });
      return;
    }

    const validPassword = await bcrypt.compare(password, user[0].password);

    if (!validPassword) {
      res.status(401).json({
        message: "Invalid credentials",
        success: false,
        data: {},
      });
      return;
    }

    const token = jwt.sign(
      {
        id: user[0].id,
        email: user[0].email,
      },
      keys.secretOrKey,
      { expiresIn: 3600 }
    );
    console.log(user);

    res.status(200).json({
      data: {
        id: user[0].id,
        name: user[0].firstName,
        lastName: user[0].lastName,
        email: user[0].email,
        phone: user[0].phone,
        roles: user[0].roles,
        token,
      },
      success: true,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const register = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) => {
  console.log(req.body);
  const { firstName, lastName, email, password, phone, image } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = (await pool.query(
      "INSERT INTO users (firstName, lastName, email, password, phone, image) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, hashedPassword, phone, image]
    )) as [ResultSetHeader, FieldPacket[]];

    //giving the client role by default

    const [row] = (await pool.query(
      "INSERT INTO user_has_roles (userId, roleId) VALUES (?, ?)",
      [result.insertId, 3]
    )) as [ResultSetHeader, FieldPacket[]];

    res.status(201).json({
      data: {
        id: result.insertId,
        firstName,
        lastName,
        email,
        phone,
        role: 3,
      },
      success: true,
      message: "User created successfully",
    });
  } catch (error: any) {
    console.log(error);
    if (error.code === MysqlErrorKeys.ER_DUP_ENTRY) {
      res.status(409).json({
        message: "User already exists",
        success: false,
        data: {},
      });
    } else {
      res.status(500).json({
        message: "Internal server error",
        success: false,
        data: {},
      });
    }
  }
};
