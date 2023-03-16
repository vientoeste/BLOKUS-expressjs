/**
 * How To Use
 * 
 * import db from '../models/index';
 * 
 * 1/
 * const cursor = db.collection('collectionName')
 * .find({ ...condition})
 * .stream().on('data', (data) => { ...do something with 'data'})
 * 2/
 * void db
 *  .collection('collectionName')
 *  .find({ ...condition })
 *  .toArray()
 *  .then((res) => {
 *    ...do something with query result
 * });
 */
import { MongoClient } from 'mongodb';

const { MONGO_ID, MONGO_PW, MONGO_HOST } = process.env;

if (!MONGO_ID || !MONGO_PW || !MONGO_HOST) {
  throw new Error('DB connection parameter not provided');
}
const url = `mongodb://${MONGO_ID}:${MONGO_PW}@${MONGO_HOST}:27017/`;

// [TODO] 각 라우터에서 매 접속 시 connection을 생성하는가?
const dbPromise = new MongoClient(url).connect().then((cli) => cli.db('blokus'));

export default dbPromise;
