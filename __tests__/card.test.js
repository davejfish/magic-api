const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const fetch = require('cross-fetch');

const mockUser = {
  email: 'test@example.com',
  password: '123456',
};

const testDeck = {
  rule_set: 'standard',
  name: 'SAMURAI DECK',
  legal: true,
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

  it(`#POST /api/v1/cards/addcard should add a card to the db if it does not exist
  and add the card to the junction table`, async () => {
    const [agent] = await registerAndLogin();
    const createDeck = await agent.post('/api/v1/decks/create').send(testDeck);
    expect(createDeck.status).toBe(200);
    let card = await fetch(
      'https://api.scryfall.com/cards/3bd81ae6-e628-447a-a36b-597e63ede295'
    );
    card = await card.json();
    const response = await agent
      .post('/api/v1/cards/addCard/1')
      .send({ card, sideboard: true });
    console.log('test ----->', response.body);
    expect(response.status).toBe(200);
  });

  it('get a cards details', async () => {
    const [agent] = await registerAndLogin();
    const createDeck = await agent.post('/api/v1/decks/create').send(testDeck);
    expect(createDeck.status).toBe(200);
    let card = await fetch(
      'https://api.scryfall.com/cards/3bd81ae6-e628-447a-a36b-597e63ede295'
    );
    card = await card.json();
    const response = await agent
      .post('/api/v1/cards/addCard/1')
      .send({ card, sideboard: true });
    expect(response.status).toBe(200);
    const getCard = await agent.get(
      '/api/v1/cards/3bd81ae6-e628-447a-a36b-597e63ede295'
    );
    expect(getCard.status).toBe(200);
  });

  it('Should delete a card from a deck', async () => {
    const [agent] = await registerAndLogin();
    const createDeck = await agent.post('/api/v1/decks/create').send(testDeck);
    expect(createDeck.status).toBe(200);
    let card = await fetch(
      'https://api.scryfall.com/cards/3bd81ae6-e628-447a-a36b-597e63ede295'
    );
    card = await card.json();
    const response = await agent
      .post('/api/v1/cards/addCard/1')
      .send({ card, sideboard: true });

    expect(response.status).toBe(200);
    const deleteFromDeck = await agent.delete(
      '/api/v1/cards/3bd81ae6-e628-447a-a36b-597e63ede295/1'
    );
    expect(deleteFromDeck.status).toBe(200);
  });

  afterAll(() => {
    pool.end();
  });
});
