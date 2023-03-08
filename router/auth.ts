import {
  Router, Request, Response, NextFunction, RequestHandler,
} from 'express';
import passport from 'passport';

const authRouter = Router();

authRouter.route('/login')
  .get((req: Request, res: Response, next: NextFunction) => {
    res.render('login');
  })
  .post(passport.authenticate('local', {
    successRedirect: '/',
    failureFlash: true,
  }) as RequestHandler);

export default authRouter;
