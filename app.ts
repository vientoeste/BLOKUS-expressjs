import express, {
  Request, Response,
} from 'express';
import path from 'path';
import nunjucks from 'nunjucks';
import mainRouter from './router/index';

const app = express();
const dirname = __dirname.slice(0, -4);

app.set('view engine', 'njk');

nunjucks.configure('views', {
  express: app,
  watch: true,
});

app.use(express.static(path.join(dirname, 'public')));
app.use('/', mainRouter);

app.listen(3000);
