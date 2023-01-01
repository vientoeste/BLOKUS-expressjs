import express, {
  Request, Response,
} from 'express';

const app = express();

app.route('/').get((req: Request, res: Response) => {
  res.send('foo');
});

app.listen(3000);
