import {
  Router, Request, Response, NextFunction,
} from 'express';
import { SessionData } from 'express-session';

interface CustomSessionData extends SessionData {
  views?: number;
}
const mainRouter = Router();

mainRouter.route('/').get((req: Request, res: Response, next: NextFunction) => {
  try {
    res.render('main', { title: 'test' });
  } catch (e) {
    next(e);
  }
});

export default mainRouter;
