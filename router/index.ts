import {
  Router, Request, Response, NextFunction,
} from 'express';
import db from '../models/index.js';

const mainRouter = Router();

mainRouter.route('/').get((req: Request, res: Response, next: NextFunction) => {
  try {
    res.render('main', { title: 'test' });
  } catch (e) {
    next(e);
  }
});

export default mainRouter;
