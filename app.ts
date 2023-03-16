import 'dotenv/config';
import express from 'express';
import path from 'path';
import nunjucks from 'nunjucks';
import morgan from 'morgan';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import session from 'express-session';

import mainRouter from './router/index.js';
import authRouter from './router/auth.js';

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

export const server = app.listen(3000);

export default app;
