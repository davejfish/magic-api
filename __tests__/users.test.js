const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  email: 'test@example.com',
  password: '123456',
};

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

  it('#POST /api/v1/users should return user already exists if user', async () => {
    const response = await request(app).post('/api/v1/users').send({
      email: 'fish@test.com',
      password: '123456',
    });
    expect(response.body).toEqual({
      status: 500,
      message: 'User already exists'
    });
  });

  it('#POST /api/v1/users/sessions should sign in an existing user', async () => {
    const response = await request(app).post('/api/v1/users/sessions').send({
      email: 'fish@test.com',
      password: '123456'
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Successfully signed in'
    });
  });

  it('#POST /api/v1/users/sessions should return an error if user does not exist', async () => {
    const response = await request(app).post('/api/v1/users/sessions').send({
      email: 'notReal@fake.com',
      password: '123456',
    });
    expect(response.body).toEqual({ status: 500, message: 'invalid credentials' });
  });


  afterAll(() => {
    pool.end();
  });
});
