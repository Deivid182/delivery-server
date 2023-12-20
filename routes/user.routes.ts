import { Router } from 'express';
import { login, register } from '../controllers/user.controller';
import { validateSchema } from '../middleware/validate-schema';
import { createUserSchema, loginUserSchema } from '../schemas/user.schema';

export const userRouter = Router();

userRouter.post('/register', validateSchema(createUserSchema), register);

userRouter.post('/login', validateSchema(loginUserSchema), login);