const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
// const fetch = require('fetch');

const mockUser = {
  email: 'test@example.com',
  password: '123456',
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  
  it(`#POST /api/v1/cards/addcard should add a card to the db if it does not exist
  and add the card to the junction table`, async () => {
    let card = await fetch('https://api.scryfall.com/cards/f295b713-1d6a-43fd-910d-fb35414bf58a');
    card = await card.json();
    const response = await request(app).post('/api/v1/cards/addCard/1').send(card);
    expect(response.status).toBe(200);
  });


  afterAll(() => {
    pool.end();
  });
});
