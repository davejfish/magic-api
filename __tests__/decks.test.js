const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  email: 'test@example.com',
  password: '123456',
};

const testDeck = {
  rule_set: 'standard',
  name: 'SAMURAI DECK'
};

const registerAndLogin = async (props = {}) => {
  const testUser = {
    ...mockUser,
    ...props
  };

  const agent = request.agent(app);
  const response = await agent
    .post('/api/v1/users')
    .send(testUser);
  const user = response.body;
  
  return [agent, user];
};

describe('backend deck route tests', () => {
  beforeEach(() => {
    return setup(pool);
  });

  
  it('#POST /api/v1/decks/create should create a new deck for a user', async () => {
    const [agent, user] = await registerAndLogin();
    const response = await agent.post('/api/v1/decks/create').send(testDeck);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      uid: user.id,
      ...testDeck,
    });
  });

  it('#POST /api/v1/decks/create should return 401 if not signed in', async () => {
    const response = await request(app).post('/api/v1/decks/create').send(testDeck);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      status: 401,
      message: 'You must be signed in to continue'
    });
  });

  it(`#GET /api/v1/decks should return a list of decks for the user
    if they are signed in`, async () => {
    const [agent, user] = await registerAndLogin();
    await Promise.all([
      agent.post('/api/v1/decks/create').send(testDeck),
      agent.post('/api/v1/decks/create').send({ ...testDeck, name: 'super deck' }),
      agent.post('/api/v1/decks/create').send({ ...testDeck, name: 'SUPER SAMURAI DECK' }),
    ]);
    const response = await agent.get('/api/v1/decks');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
    expect(response.body[0]).toEqual({
      id: expect.any(String),
      uid: user.id,
      name: expect.any(String),
      rule_set: 'standard',
    });
  });

  it('#GET /api/v1/decks should return 401 if not signed in', async () => {
    const response = await request(app).get('/api/v1/decks');
    expect(response.body).toEqual({
      status: 401,
      message: 'You must be signed in to continue',
    });
  });

  afterAll(() => {
    pool.end();
  });
});
