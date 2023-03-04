import express from 'express';
import path from 'path';
import nunjucks from 'nunjucks';
import * as dotenv from 'dotenv';
dotenv.config();
import { fileURLToPath } from 'url';

import mainRouter from './router/index.js';

const dirname = fileURLToPath(new URL('.', import.meta.url));

const app = express();

app.set('view engine', 'njk');

nunjucks.configure('views', {
  express: app,
  watch: true,
});

app.use(express.static(path.join(dirname, 'public')));
app.use('/', mainRouter);

app.listen(3000);
