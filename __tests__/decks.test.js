const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  email: 'test@example.com',
  password: '123456',
};

// eslint-disable-next-line no-unused-vars
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

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  
  it('basic test', async () => {
    expect(1).toEqual(1);
  });

  afterAll(() => {
    pool.end();
  });
});
