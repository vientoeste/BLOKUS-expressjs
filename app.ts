import 'dotenv/config';
import express from 'express';
import path from 'path';
import nunjucks from 'nunjucks';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import session from 'express-session';
const dirname = fileURLToPath(new URL('.', import.meta.url));

import mainRouter from './router/index.js';
import authRouter from './router/auth.js';

const app = express();

app.set('view engine', 'njk');

nunjucks.configure('views', {
  express: app,
  watch: true,
});

const redisClient = createClient();

app.use(express.static(path.join(dirname, 'public')));
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

app.listen(3000);
