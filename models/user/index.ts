/**
 * How To Use
 * 
 * import { getSomeInfo } from 'here';
 * 
 * // inside some router
 * ...
 * const somePromise = getSomeInfo(condition);
 * somePromise
 *   .then((value) => { ...do something })
 *   .catch((err) => next(err))
 * ...
 */
import { ObjectId } from 'mongodb';
import db from '../index.js';
const userColl = db.collection('user');

interface User {
  id: string;
  password: string;
}

export const getUserAuthInfo = (userId: string): Promise<User> => new Promise((resolve, reject) => {
  const retArr: User[] = [];
  const stream = userColl.find({ id: userId }).stream();
  stream.on('data', (queryRes: (User & { _id: ObjectId })[] | (User & { _id: ObjectId })) => {
    if (!Array.isArray(queryRes)) {
      retArr.push({
        id: queryRes.id,
        password: queryRes.password,
      });
    }
    if (Array.isArray(queryRes) && queryRes.length === 1) {
      queryRes.forEach((val) => {
        retArr.push({
          id: val.id,
          password: val.password,
        });
      });
    }
  });
  stream.on('end', () => {
    if (retArr.length !== 1) {
      reject('query length not 1');
    }
    resolve(retArr[0]);
  });
  stream.on('error', (err) => {
    reject(err);
  });
});
