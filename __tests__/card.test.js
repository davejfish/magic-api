const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const fetch = require('cross-fetch');


// jest.mock('../lib/services/cardService');

const mockUser = {
  email: 'test@example.com',
  password: '123456',
};

const testDeck = {
  rule_set: 'standard',
  name: 'SAMURAI DECK',
  legal: true
};

const registerAndLogin = async (props = {}) => {
  const testUser = {
    ...mockUser,
    ...props,
  };

  const agent = request.agent(app);
  const response = await agent.post('/api/v1/users').send(testUser);
  const user = response.body;

  return [agent, user];
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('#POST /api/v1/cards/add/:deckID should add a card to decks_cards', async () => {
    const [agent] = await registerAndLogin();
    const response = await agent.post('/api/v1/cards/add/1').send([
      {
        name: 'Indebted Samurai'
      },
      {
        name: 'Indebted Samurai'
      },
      {
        name: 'Isshin, two heavens as one'
      }
    ]);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
  });

  it('Should delete a card from a deck', async () => {
    const [agent] = await registerAndLogin();
    const response = await agent.post('/api/v1/cards/add/1').send([
      {
        name: 'Indebted Samurai'
      }
    ]);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);

    const deleteFromDeck = await agent.delete(
      `/api/v1/cards/${response.body[0].sk_id}/${response.body[0].deck_id}`
    );
    console.log(response.body);
    console.log(response.body.deck_id);
    expect(deleteFromDeck.status).toBe(200);
  });

  it('#POST sending up a collection of cards returns an array of cards', async () => {
    const [agent] = await registerAndLogin();
    const createDeck = await agent.post('/api/v1/decks/create').send(testDeck);
    expect(createDeck.status).toBe(200);
    //works up to here

    
  });

  afterAll(() => {
    pool.end();
  });
});
