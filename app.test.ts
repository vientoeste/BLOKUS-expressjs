import request from 'supertest';
import app, { redisClient, server } from './app';

describe('GET /ex', () => {
  it('responds with json', async () => {
    const res = await request(app).get('/ex');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Hello World');
  });
});

afterAll(async () => {
  server.close();
  // [TODO] needs mongodb disconnect here
  await redisClient.disconnect();
});