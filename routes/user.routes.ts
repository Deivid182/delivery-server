import { Router } from 'express';
import { login, register, updateUser } from '../controllers/user.controller';
import { validateSchema } from '../middleware/validate-schema';
import { createUserSchema, loginUserSchema, updateUserSchema } from '../schemas/user.schema';

export const userRouter = Router();

userRouter.post('/register', validateSchema(createUserSchema), register);

userRouter.post('/login', validateSchema(loginUserSchema), login);

userRouter.patch('/update/:id', validateSchema(updateUserSchema), updateUser);