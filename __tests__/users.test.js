const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  email: 'test@example.com',
  password: '123456',
};

// const registerAndLogin = async (props = {}) => {
//   const testUser = {
//     ...mockUser,
//     ...props
//   };

//   const agent = request.agent(app);
//   const response = await agent
//     .post('/api/v1/users')
//     .send(testUser);
//   const user = response.body;
  
//   return [agent, user];
// };

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  
  it('#POST /api/v1/users should create and login a new user', async () => {
    const response = await request(app).post('/api/v1/users').send(mockUser);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      username: null,
      email: 'test@example.com'
    });
  });


  afterAll(() => {
    pool.end();
  });
});
