import request from 'supertest';
import app, { redisClient, server } from './app';
import { CreateGameRequestBody, CreateUserRequestBody, SignInRequestBody, UpdateGameRequestBody } from './interfaces/ReqBody';
import { client } from './models/index';

beforeAll(async () => {
  await client.connect();
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
 * POST /users
 * sign up request
 */
describe('POST /users', () => {
  it('unsuccessful sign up request: empty field', async () => {
    const emptyIDResult = await request(app)
      .post('/users')
      .send({
        id: '',
        password: process.env.TEST_ACCOUNT_PW,
      } as CreateUserRequestBody);
    const emptyPWResult = await request(app)
      .post('/users')
      .send({
        id: process.env.TEST_ACCOUNT_ID,
        password: '',
      } as CreateUserRequestBody);

    expect(emptyIDResult.statusCode).toEqual(400);
    expect(emptyPWResult.statusCode).toEqual(400);
  });

  it('unsuccessful sign up request: missing field', async () => {
    const emptyIDResult = await request(app)
      .post('/users')
      .send({
        password: process.env.TEST_ACCOUNT_PW,
      });
    const emptyPWResult = await request(app)
      .post('/users')
      .send({
        id: process.env.TEST_ACCOUNT_ID,
      });

    expect(emptyIDResult.statusCode).toEqual(400);
    expect(emptyPWResult.statusCode).toEqual(400);
  });

  it('unsuccessful sign up request: max length exceed', async () => {
    const tooLongId: request.Response = await request(app)
      .post('/users')
      .send({
        id: String(process.env.TEST_ACCOUNT_ID).repeat(100),
        password: process.env.TEST_ACCOUNT_PW,
      } as CreateUserRequestBody);
    const tooLongPW: request.Response = await request(app)
      .post('/users')
      .send({
        id: process.env.TEST_ACCOUNT_ID,
        password: String(process.env.TEST_ACCOUNT_PW).repeat(100),
      } as CreateUserRequestBody);

    expect(tooLongId.statusCode).toEqual(400);
    expect(tooLongPW.statusCode).toEqual(400);
  });

  it('unsuccessful sign up request: short of length', async () => {
    const tooShortId: request.Response = await request(app)
      .post('/users')
      .send({
        id: String(process.env.TEST_ACCOUNT_ID).slice(0, 1),
        password: process.env.TEST_ACCOUNT_PW,
      } as CreateUserRequestBody);
    const tooShortPW: request.Response = await request(app)
      .post('/users')
      .send({
        id: process.env.TEST_ACCOUNT_ID,
        password: String(process.env.TEST_ACCOUNT_PW).slice(0, 1),
      } as CreateUserRequestBody);

    expect(tooShortId.statusCode).toEqual(400);
    expect(tooShortPW.statusCode).toEqual(400);
  });

  it('unsuccessful sign up request: forbidden special characters', async () => {
    const forbiddenId: request.Response = await request(app)
      .post('/users')
      .send({
        id: String(process.env.TEST_ACCOUNT_ID).replace(/\d{1}/, '$'),
        password: process.env.TEST_ACCOUNT_PW,
      } as CreateUserRequestBody);
    const forbiddenPW: request.Response = await request(app)
      .post('/users')
      .send({
        id: process.env.TEST_ACCOUNT_ID,
        password: String(process.env.TEST_ACCOUNT_PW).replace(/\d{1}/, '$'),
      } as CreateUserRequestBody);

    expect(forbiddenId.statusCode).toEqual(400);
    expect(forbiddenPW.statusCode).toEqual(400);
  });

  it('successful sign up request', async () => {
    const res: request.Response = await request(app)
      .post('/users')
      .send({
        id: process.env.TEST_ACCOUNT_ID,
        password: process.env.TEST_ACCOUNT_PW,
      } as CreateUserRequestBody);

    expect(res.statusCode).toEqual(200);
  });

  it('unsuccessful sign up request: duplicate ID', async () => {
    const res: request.Response = await request(app)
      .post('/users')
      .send({
        id: process.env.TEST_ACCOUNT_ID,
        password: process.env.TEST_ACCOUNT_PW,
      } as CreateUserRequestBody);

    expect(res.statusCode).toEqual(400);
  });
});

/**
 * POST /auth/signIn
 * sign in request
 */
describe('POST /auth', () => {
  it('unsuccessful sign in request: missing ID field', async () => {
    const res: request.Response = await request(app)
      .post('/auth')
      .send({
        password: process.env.TEST_ACCOUNT_PW,
      });
    expect(res.statusCode).toEqual(400);
  });

  it('unsuccessful sign in request: missing PW field', async () => {
    const res: request.Response = await request(app)
      .post('/auth')
      .send({
        id: process.env.TEST_ACCOUNT_ID,
      });
    expect(res.statusCode).toEqual(400);
  });

  it('unsuccessful sign in request: empty ID field', async () => {
    const res: request.Response = await request(app)
      .post('/auth')
      .send({
        id: '',
        password: process.env.TEST_ACCOUNT_PW,
      } as SignInRequestBody);
    expect(res.statusCode).toEqual(400);
  });

  it('unsuccessful sign in request: empty PW field', async () => {
    const res: request.Response = await request(app)
      .post('/auth')
      .send({
        id: process.env.TEST_ACCOUNT_ID,
        password: '',
      } as SignInRequestBody);
    expect(res.statusCode).toEqual(400);
  });

  it('unsuccessful sign in request: wrong PW', async () => {
    const res: request.Response = await request(app)
      .post('/auth')
      .send({
        id: process.env.TEST_ACCOUNT_ID,
        password: '',
      } as SignInRequestBody);
    expect(res.statusCode).toEqual(400);
  });

  it('unsuccessful sign in request: non-existing ID', async () => {
    const res: request.Response = await request(app)
      .post('/auth')
      .send({
        id: String(process.env.TEST_ACCOUNT_ID).slice(0, -1),
        password: '',
      } as SignInRequestBody);
    expect(res.statusCode).toEqual(400);
  });

  it('successful sign in request', async () => {
    const res: request.Response = await request(app)
      .post('/auth')
      .send({
        id: process.env.TEST_ACCOUNT_ID,
        password: process.env.TEST_ACCOUNT_PW,
      } as SignInRequestBody);
    expect(res.statusCode).toEqual(200);
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
  it('unsuccessful game room create request: missing title field', async () => {
    const res: request.Response = await request(app)
      .post('/games')
      .send({
        maxParticipants: 2,
      } as CreateGameRequestBody);
    expect(res.statusCode).toEqual(400);
  });

  it('unsuccessful game room create request: missing maxParticipants field', async () => {
    const res: request.Response = await request(app)
      .post('/games')
      .send({
        title: 'exRoom',
      } as CreateGameRequestBody);
    expect(res.statusCode).toEqual(400);
  });

  it('unsuccessful game room create request: empty title', async () => {
    const res: request.Response = await request(app)
      .post('/games')
      .send({
        title: '',
        maxParticipants: 2,
      } as CreateGameRequestBody);
    expect(res.statusCode).toEqual(400);
  });

  it('unsuccessful game room create request: too big maxParticipants', async () => {
    const res: request.Response = await request(app)
      .post('/games')
      .send({
        title: 'exRoom',
        maxParticipants: 5,
      } as CreateGameRequestBody);
    expect(res.statusCode).toEqual(400);
  });

  it('unsuccessful game room create request: too small maxParticipants', async () => {
    const res: request.Response = await request(app)
      .post('/games')
      .send({
        title: 'exRoom',
        maxParticipants: 0,
      } as CreateGameRequestBody);
    expect(res.statusCode).toEqual(400);
  });

  it('unsuccessful game room create request: too long title', async () => {
    const res: request.Response = await request(app)
      .post('/games')
      .send({
        title: 'exRoom'.repeat(100),
        maxParticipants: 2,
      } as CreateGameRequestBody);
    expect(res.statusCode).toEqual(400);
  });

  it('successful game room create request - without password', async () => {
    const res: request.Response = await request(app)
      .post('/games')
      .send({
        title: 'exRoom',
        maxParticipants: 2,
      } as CreateGameRequestBody);
    expect(res.statusCode).toEqual(201);
  });

  it('successful game room create request - with password', async () => {
    const res: request.Response = await request(app)
      .post('/games')
      .send({
        title: 'exPrivRoom',
        maxParticipants: 2,
        password: 'pwForexPrivRoom',
      } as CreateGameRequestBody);
    expect(res.statusCode).toEqual(201);
  });

  it('unsuccessful game room create request: duplicate room title', async () => {
    const res: request.Response = await request(app)
      .post('/games')
      .send({
        title: 'exRoom',
        maxParticipants: 2,
      } as CreateGameRequestBody);
    expect(res.statusCode).toEqual(400);
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
  it('unsuccessful room info update request: missing field', async () => {
    const gameUuid = 'some-game-uuid';
    const res: request.Response = await request(app)
      .put(`/games/${gameUuid}`)
      .send({} as Partial<UpdateGameRequestBody>);
    expect(res.statusCode).toEqual(400);
  });

  it('unsuccessful room info update request: empty title field', async () => {
    const gameUuid = 'some-game-uuid';
    const res: request.Response = await request(app)
      .put(`/games/${gameUuid}`)
      .send({ title: '' } as Partial<UpdateGameRequestBody>);
    expect(res.statusCode).toEqual(400);
  });

  it('unsuccessful room info update request: empty password field', async () => {
    const gameUuid = 'some-game-uuid';
    const res: request.Response = await request(app)
      .put(`/games/${gameUuid}`)
      .send({ password: '' } as Partial<UpdateGameRequestBody>);
    expect(res.statusCode).toEqual(400);
  });

  it('unsuccessful room info update request: too long title', async () => {
    const gameUuid = 'some-game-uuid';
    const res: request.Response = await request(app)
      .put(`/games/${gameUuid}`)
      .send({ title: 'toolongtitle'.repeat(10) } as Partial<UpdateGameRequestBody>);
    expect(res.statusCode).toEqual(400);
  });

  it('unsuccessful room info update request: too big maxParticipants', async () => {
    const gameUuid = 'some-game-uuid';
    const res: request.Response = await request(app)
      .put(`/games/${gameUuid}`)
      .send({ maxParticipants: 5 } as Partial<UpdateGameRequestBody>);
    expect(res.statusCode).toEqual(400);
  });

  it('unsuccessful room info update request: too small maxParticipants', async () => {
    const gameUuid = 'some-game-uuid';
    const res: request.Response = await request(app)
      .put(`/games/${gameUuid}`)
      .send({ maxParticipants: 0 } as Partial<UpdateGameRequestBody>);
    expect(res.statusCode).toEqual(400);
  });

  it('successful room info update request - maxParticipants', async () => {
    const gameUuid = 'some-game-uuid';
    const res: request.Response = await request(app)
      .put(`/games/${gameUuid}`)
      .send({ maxParticipants: 4 } as Partial<UpdateGameRequestBody>);
    expect(res.statusCode).toEqual(200);
  });

  it('successful room info update request - password(injectPW)', async () => {
    const gameUuid = 'some-game-uuid';
    const res: request.Response = await request(app)
      .put(`/games/${gameUuid}`)
      .send({ password: 'passwordOfexRoom' } as Partial<UpdateGameRequestBody>);
    expect(res.statusCode).toEqual(200);
  });

  it('successful room info update request - password(changePW)', async () => {
    const gameUuid = 'some-game-uuid';
    const res: request.Response = await request(app)
      .put(`/games/${gameUuid}`)
      .send({ password: 'passwordOfexRoom' } as Partial<UpdateGameRequestBody>);
    expect(res.statusCode).toEqual(200);
  });

  it('successful room info update request - title', async () => {
    const gameUuid = 'some-game-uuid';
    const res: request.Response = await request(app)
      .put(`/games/${gameUuid}`)
      .send({ title: 'exRoom1' } as Partial<UpdateGameRequestBody>);
    expect(res.statusCode).toEqual(200);
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
