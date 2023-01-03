import express, {
  Request, Response,
} from 'express';
import path from 'path';
import nunjucks from 'nunjucks';

const app = express();
const dirname = __dirname.slice(0, -4);

app.set('view engine', 'njk');

nunjucks.configure('views', {
  express: app,
  watch: true,
});

app.use(express.static(path.join(dirname, 'public')));

app.route('/').get((req: Request, res: Response) => {
  // res.sendFile(path.join(dirname, 'view', 'ex.html'));
  res.render('main', { title: 'test' });
});

app.listen(3000);
