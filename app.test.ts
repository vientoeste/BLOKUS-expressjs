import request from 'supertest';
import app, { redisClient, server } from './app';
import { client } from './models/index';

beforeAll(async () => {
  await client.connect();
});

describe('GET /ex', () => {
  it('responds with json', async () => {
    const res = await request(app).get('/ex');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Hello World');
  });
});

// RESTful api + proper WS configuration
// [TODO] must add the test cases before development(for proper TDD)
/**
 * GET /
 * main page
 */
describe('GET /', () => {
  it('res, home page', async () => {
    const res: request.Response = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });
});

/**
 * GET /auth
 * provides sign in/up/out form
 */
describe('GET /auth', () => {
  it('sign in/up/out form', async () => {
    const res: request.Response = await request(app).get('/auth');
    expect(res.statusCode).toEqual(200);
    // expect(res.headers).toMatch(/json/);
    console.log(res.headers);
  });
});

/**
 * POST /auth/signIn
 * sign in request
 */
describe('POST /auth', () => {
  it('sign in request', async () => {
    const res: request.Response = await request(app)
      .post('/auth')
      .send({ /* some auth info */ });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({/* some json response */ });
  });
});

/**
 * POST /auth/signOut
 * sign out request
 */
describe('POST /auth/signOut', () => {
  it('sign out request', async () => {
    const res: request.Response = await request(app)
      .post('/auth/signOut');
    expect(res.statusCode).toEqual(200);
  });
});

/**
 * POST /users
 * sign up request
 */
describe('POST /users', () => {
  it('sign up request', async () => {
    const res: request.Response = await request(app)
      .post('/users')
      .send({ /* some auth info */ });
    expect(res.statusCode).toEqual(200);
  });
});

/**
 * GET /users/my
 * display user info
 */
describe('GET /users/my', () => {
  it('display user info', async () => {
    const res: request.Response = await request(app)
      .get('/users/my');
    expect(res.statusCode).toEqual(200);
  });
});

/**
 * GET /users/{user_uuid}
 * display user info
 */
describe('GET /users/{user_uuid}', () => {
  it('sign in request', async () => {
    const res: request.Response = await request(app)
      .get('/auth')
      .send({ /* some auth info */ });
    expect(res.statusCode).toEqual(200);
  });
});

/**
 * POST /games
 * make a room for game
 */
describe('POST /games', () => {
  it('successfully creates a room for game', async () => {
    const res: request.Response = await request(app)
      .post('/games')
      .send({ /* some game room info */ });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({ /* some json response */ });
  });
});

/**
 * GET /games
 * display a list of rooms
 */
describe('GET /games', () => {
  it('successfully retrieves a list of game rooms', async () => {
    const res: request.Response = await request(app).get('/games');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([/* some json array response */]);
  });
});

/**
 * GET /games/{game_uuid}
 * [optional] display room info(game settings)
 */
describe('GET /games/:game_uuid', () => {
  it('successfully retrieves room info', async () => {
    const gameUuid = 'some-game-uuid';
    const res: request.Response = await request(app).get(`/games/${gameUuid}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ /* some json response */ });
  });
});

/**
 * PUT /games/{game_uuid}
 * [optional] update room info(game settings)
 */
describe('PUT /games/:game_uuid', () => {
  it('successfully updates room info', async () => {
    const gameUuid = 'some-game-uuid';
    const res: request.Response = await request(app)
      .put(`/games/${gameUuid}`)
      .send({ /* some updated game room info */ });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ /* some json response */ });
  });
});

/**
 * WS {game_uuid} - deleteRoom
 * delete game room, only for creator
 * emit: creator
 * listen: participants, throw redirection to room list and alert to some ways(like modal)
 */

/**
 * WS {game_uuid} - join
 * join the room
 * emit: user who wants to participate the room
 * listen: participants
 */

/**
 * WS {game_uuid} - start
 * start the game(creator only)
 * emit: creator
 * listen: participants. start the game and set clients' variable about game info
 */

/**
 * WS {game_uuid} - stop
 * stop the game(creator only)
 * emit: creator
 * listen: participants. stop the game and count the score
 */

/**
 * WS {game_uuid} - surrender
 * surrender the game
 * emit: participant who wants to surrender
 * listen: remaining participants must play the quit player
 */

/**
 * WS {game_uuid} - putBlock
 * put the block on the right turn of each participants
 * emit: put the block
 * listen: receive the block data and update one's board
 */

afterAll(async () => {
  server.close();
  // [TODO] needs to fix mongodb connection disconnection logic
  await client.close();
  await redisClient.disconnect();
});
