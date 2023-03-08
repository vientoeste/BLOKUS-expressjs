import passport from 'passport';
import { Strategy } from 'passport-local';
import { getUserAuthInfo } from '../models/user';
import { pbkdf2, timingSafeEqual } from 'crypto';

interface User {
  id: string;
  password: string;
}

passport.use(new Strategy((username, password, cb) => {
  getUserAuthInfo(username)
    .then((queryRes: User) => {
      if (!queryRes.password) {
        return cb('internal error');
      }
      pbkdf2(password, queryRes.password, 310000, 32, 'sha256', (err, hashedPw) => {
        if (err) {
          return cb(err);
        }
        if (!timingSafeEqual(Buffer.from(queryRes.password), hashedPw)) {
          return cb(null, false, { message: 'Incorrect username or password.' });
        }
        return cb(null, queryRes);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}));
