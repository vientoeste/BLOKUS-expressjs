import request from 'supertest';
import app from './app';

// [TODO] Promise returned
describe('GET /ex', () => {
  it('responds with json', async () => {
    await request(app)
      .get('/ex')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, { message: 'Hello World' });
  });
});