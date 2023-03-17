import request from 'supertest';
import app, { redisClient, server } from './app';

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
 * GET /auth
 * main page
 * provides sign in/up/out form
 */

/**
 * POST /auth/signIn
 * sign in request
 */

/**
 * POST /auth/signOut
 * sign out request
 */

/**
 * POST /users
 * sign up request
 */

/**
 * GET /users
 * display user info
 */

/**
 * POST /games
 * make a room for game
 */

/**
 * GET /games
 * display a list of rooms
 */

/**
 * GET /games/{game_uuid}
 * [optional] display room info(game settings)
 */

/**
 * PUT /games/{game_uuid}
 * [optional] update room info(game settings)
 */

/**
 * DELETE /games/{game_uuid}
 * delete game room, only for creator
 */

/**
 * POST /games/{game_uuid}/join
 * join the room
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
 * WS, {game_uuid} - surrender
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
  // [TODO] needs mongodb disconnect here
  await redisClient.disconnect();
});