import { Router } from 'express';

const mainRouter = Router();

mainRouter.route('/').get((req, res, next) => {
  try {
    res.render('main', { title: 'test' });
  } catch (e) {
    next(e);
  }
});

export default mainRouter;
