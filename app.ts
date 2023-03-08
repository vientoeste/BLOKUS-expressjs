import 'dotenv/config';
import express from 'express';
import path from 'path';
import nunjucks from 'nunjucks';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
const dirname = fileURLToPath(new URL('.', import.meta.url));

import mainRouter from './router/index.js';
import authRouter from './router/auth.js';

const app = express();

app.set('view engine', 'njk');

nunjucks.configure('views', {
  express: app,
  watch: true,
});

app.use(express.static(path.join(dirname, 'public')));
app.use(morgan('dev'));
app.use('/', mainRouter);
app.use('/auth', authRouter);

app.listen(3000);
