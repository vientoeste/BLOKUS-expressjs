import 'dotenv/config';
// intended to be used with block scope
const validateEnvVars = () => {
  const RequiredEnvironmentVars = [
    'MONGO_ID',
    'MONGO_PW',
    'MONGO_HOST',
    'COOKIE_SECRET',
    'PORT',
    'NODE_ENV',
    'TEST_ACCOUNT_ID',
    'TEST_ACCOUNT_PW',
  ];
  const {
    MONGO_ID,
    MONGO_PW,
    MONGO_HOST,
    COOKIE_SECRET,
    PORT,
    NODE_ENV,
    TEST_ACCOUNT_ID,
    TEST_ACCOUNT_PW,
  } = process.env;
  const invalidParams = [
    MONGO_ID,
    MONGO_PW,
    MONGO_HOST,
    COOKIE_SECRET,
    PORT,
    NODE_ENV,
    TEST_ACCOUNT_ID,
    TEST_ACCOUNT_PW,
  ].map((param, index) => {
    if (typeof param === 'undefined' || param === null) {
      return RequiredEnvironmentVars[index];
    }
    return 0;
  }).filter(e => e !== 0);

  if (invalidParams.length > 0) {
    throw new Error(`missing system env params: ${invalidParams.join(', ')}`);
  }
};
validateEnvVars();

import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import nunjucks from 'nunjucks';
import morgan from 'morgan';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import session from 'express-session';
import { serve, setup } from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

import mainRouter from './controllers/index.js';
import authRouter from './controllers/auth.js';

class CustomError extends Error {
  constructor(message: string, status?: number) {
    super(message);
    Object.defineProperty(this, 'name', {
      configurable: true,
      writable: false,
      value: 'Error',
    });
    if (status) {
      this.status = status;
    }
  }

  status?: number;
}

const app = express();

app.set('view engine', 'njk');

nunjucks.configure('views', {
  express: app,
  watch: true,
});

export const redisClient = createClient();
redisClient.connect().then(() => { }).catch(console.error);

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: String(process.env.COOKIE_SECRET),
  name: 'sessionId',
  cookie: {
    httpOnly: true,
    secure: true,
  },
  store: new RedisStore({
    client: redisClient,
  }),
}));
app.use(morgan('dev'));
app.use('/', mainRouter);
app.use('/auth', authRouter);
app.use('/api-docs', serve, setup(swaggerDocument));

app.use((req: Request, _res: Response, next: NextFunction) => {
  const error = new CustomError(`Not existing router: ${req.method} ${req.url}`);
  error.status = 404;
  next(error);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: CustomError, req: Request, res: Response, _next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = err;
  res.status(err.status ?? 500);
  res.redirect(`${req.url}/?error=${err.message}`);
});

export const server = app.listen(3000);

export default app;
