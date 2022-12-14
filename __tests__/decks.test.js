const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { checkRules } = require('../lib/utils/utils.js');
const { testCollection } = require('../data/testCollection.js');

const mockUser = {
  email: 'test@example.com',
  password: '123456',
};

const mockUser2 = {
  email: 'test2@example.com',
  password: '234567',
};

const testDeck = {
  rule_set: 'standard',
  name: 'SAMURAI DECK',
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

describe('backend deck route tests', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('#testing utls', async () => {
    const [agent] = await registerAndLogin();
    const deck = await agent.post('/api/v1/decks/create').send(testDeck);
    await agent.post(`/api/v1/cards/add/${deck.body.id}`).send(testCollection);
    const response = await checkRules(deck.body);
    expect(response).toEqual([
      { message: 'Only 60 cards allowed per deck.' },
    ]);
  });

  it('#POST /api/v1/decks/create should create a new deck for a user', async () => {
    const [agent, user] = await registerAndLogin();
    const response = await agent.post('/api/v1/decks/create').send(testDeck);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      uid: user.id,
      legal: false,
      ...testDeck,
    });
  });

  it('#POST /api/v1/decks/create should return 401 if not signed in', async () => {
    const response = await request(app)
      .post('/api/v1/decks/create')
      .send(testDeck);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      status: 401,
      message: 'You must be signed in to continue',
    });
  });


  it(`#GET /api/v1/decks/user-decks should return a list of decks for the user
    if they are signed in`, async () => {
    const [agent, user] = await registerAndLogin();
    await Promise.all([
      agent.post('/api/v1/decks/create').send(testDeck),
      agent
        .post('/api/v1/decks/create')
        .send({ ...testDeck, name: 'super deck' }),
      agent
        .post('/api/v1/decks/create')
        .send({ ...testDeck, name: 'SUPER SAMURAI DECK' }),
    ]);
    const response = await agent.get('/api/v1/decks/user-decks');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
    expect(response.body[0]).toEqual({
      id: expect.any(String),
      uid: user.id,
      name: expect.any(String),
      rule_set: 'standard',
      legal: false,
    });
  });


  it('#GET /api/v1/decks/user-decks should return 401 if not signed in', async () => {
    const response = await request(app).get('/api/v1/decks/user-decks');
    expect(response.body).toEqual({
      status: 401,
      message: 'You must be signed in to continue',
    });
  });

  it('#GET /api/v1/decks should return all decks', async () => {
    const [agent] = await registerAndLogin();
    await agent.post('/api/v1/decks/create').send(testDeck);

    const response = await request(app).get('/api/v1/decks');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it('#GET /api/v1/decks/:id should return a specific deck', async () => {
    const [agent] = await registerAndLogin();
    await agent.post('/api/v1/decks/create').send(testDeck);

    const response = await request(app).get('/api/v1/decks/2');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ...testDeck,
      legal: false,
      id: '2',
      uid: expect.any(String),
    });
  });

  it('#GET /api/v1/decks/deck-cards/:deckID gets a deck with cards', async () => {
    const [agent] = await registerAndLogin();
    const deck = await agent.post('/api/v1/decks/create').send(testDeck);
    expect(deck.status).toBe(200);

    await agent.post(`/api/v1/cards/add/${deck.body.id}`).send([{ id: '35a236f7-f008-4eb8-91d9-31ea8589cf0c' }, { id: 'e5b2176d-8925-4474-9d3e-1c97192715fb' }]);
    
    const response = await agent.get(`/api/v1/decks/decks-cards/${deck.body.id}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it('#PUT /api/v1/decks/:deckID updates a users deck', async () => {
    const [agent] = await registerAndLogin();
    const sendDeck = await agent.post('/api/v1/decks/create').send(testDeck);
    expect(sendDeck.status).toBe(200);

    const response = await agent
      .put(`/api/v1/decks/${sendDeck.body.id}`)
      .send({ name: 'Ninja Deck' });

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual('Ninja Deck');
  });

  it('#DELETE /api/v1/decks/:deckID deletes a users deck', async () => {
    const [agent] = await registerAndLogin();
    const sendDeck = await agent.post('/api/v1/decks/create').send(testDeck);
    expect(sendDeck.status).toBe(200);

    let response = await agent.delete(`/api/v1/decks/${sendDeck.body.id}`);
    expect(response.status).toBe(200);

    response = await agent.get(`/api/v1/decks/${sendDeck.body.id}`);
    expect(response.body).toBe(null);
  });

  it('#DELETE /api/v1/decks/:id returns a 403 to an unauthorized user', async () => {
    const [agent] = await registerAndLogin();

    const agent2 = request.agent(app);
    const secondLogin = await agent2.post('/api/v1/users').send(mockUser2);

    expect(secondLogin.status).toBe(200);

    const newDeck = await agent.post('/api/v1/decks/create').send(testDeck);
    expect(newDeck.status).toBe(200);

    const response = await agent2.delete(`/api/v1/decks/${newDeck.body.id}`);

    expect(response.status).toBe(403);
  });

  it('#GET /api/v1/decks/:deckID/legal should return the legality of a deck', async () => {
    const [agent] = await registerAndLogin();
    const deck = await agent.post('/api/v1/decks/create').send(testDeck);
    await agent.post(`/api/v1/cards/add/${deck.body.id}`).send(testCollection);

    const response = await agent.get(`/api/v1/decks/${deck.body.id}/legal`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ message: 'Only 60 cards allowed per deck.' }]);
  });

  afterAll(() => {
    pool.end();
  });
});
