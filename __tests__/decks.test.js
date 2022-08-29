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

  afterAll(() => {
    pool.end();
  });
});
