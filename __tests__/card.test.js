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

  it('#POST /api/v1/cards/add/:deckID should add cards to decks_cards', async () => {
    const [agent] = await registerAndLogin();
    const deck = await agent.post('/api/v1/decks/create').send(testDeck);
    const response = await agent.post(`/api/v1/cards/add/${deck.body.id}`).send([
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
    console.log('response is: ', response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
  });

  it('Should delete a card from a deck', async () => {
    const [agent] = await registerAndLogin();
    const deck = await agent.post('/api/v1/decks/create').send(testDeck);
    const response = await agent.post(`/api/v1/cards/add/${deck.body.id}`).send([
      {
        name: 'Indebted Samurai'
      }
    ]);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);

    const deleteFromDeck = await agent.delete(
      `/api/v1/cards/${response.body[0].sk_id}/${response.body[0].deck_id}`
    );
    expect(deleteFromDeck.status).toBe(200);
  });

  it('Should delete all cards from a deck', async () => {
    const [agent] = await registerAndLogin();
    const deck = await agent.post('/api/v1/decks/create').send(testDeck);
    const response = await agent.post(`/api/v1/cards/add/${deck.body.id}`).send([
      {
        name: 'Indebted Samurai'
      },
      {
        name: 'Indebted Samurai'
      },
      {
        name: 'Indebted Samurai'
      },
      {
        name: 'Indebted Samurai'
      }
    ]);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(4);

    const deleteFromDeck = await agent.delete(
      `/api/v1/cards/${response.body[0].deck_id}`
    );
    expect(deleteFromDeck.status).toBe(200);
  });

  afterAll(() => {
    pool.end();
  });
});
