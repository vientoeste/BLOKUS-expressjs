import { MongoClient } from 'mongodb';

const { MONGO_ID, MONGO_PW, MONGO_HOST } = process.env;

if (!MONGO_ID || !MONGO_PW || !MONGO_HOST) {
  throw new Error('DB connection parameter not provided');
}
const url = `mongodb://${MONGO_ID}:${MONGO_PW}@${MONGO_HOST}:27017/`;

// [TODO] fix the type error with mongoclient
const client = new MongoClient(url);
