import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import http from 'http';
import logger from 'morgan';
import passport from 'passport';
import { PORT } from './config/config';
import keys from './config/keys';
import passportMiddleware from './config/passport';
import { userRouter } from './routes/user.routes';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
  secret: keys.secretOrKey,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(passportMiddleware)

app.disable('x-powered-by');
const server = http.createServer(app);

app.set('port', PORT);

app.use('/api/users', userRouter);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: error.message, status: error.status || 500 });
})

export { server };
