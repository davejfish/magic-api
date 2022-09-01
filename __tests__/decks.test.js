const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
// const fetch = require('cross-fetch');
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
  legal: true,
};

const emptyDeck = {
  rule_set: 'standard',
  name: 'Copied from -',
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

describe('backend deck route tests', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('#testing utls', async () => {
    const deck = { rule_set: 'standard', id: '1' };
    const response = await checkRules(deck);
    expect(response).toEqual({
      message: 'Deck is legal.',
    });
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
      legal: true,
    });
  });

  it('#testing utls', async () => {
    const deck = { rule_set: 'standard', id: '1' };
    const response = await checkRules(deck);
    expect(response).toEqual({
      message: 'Deck is legal.',
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
      id: '2',
      uid: expect.any(String),
    });
  });

  it('#GET /api/v1/decks/deck-cards/:id gets a deck with cards', async () => {
    const [agent] = await registerAndLogin();
    await agent.post('/api/v1/decks/create').send(testDeck);

    let card = await fetch(
      'https://api.scryfall.com/cards/35a236f7-f008-4eb8-91d9-31ea8589cf0c'
    );
    card = await card.json();
    await agent
      .post('/api/v1/cards/addCard/2')
      .send({ card, sideboard: false });

    card = await fetch(
      'https://api.scryfall.com/cards/e5b2176d-8925-4474-9d3e-1c97192715fb'
    );
    card = await card.json();
    await agent
      .post('/api/v1/cards/addCard/2')
      .send({ card, sideboard: false });

    const response = await agent.get('/api/v1/decks/decks-cards/2');
    expect(response.status).toBe(200);
    expect(response.body.cards.length).toBe(2);
  });

  it('#PUT /api/v1/decks/:id updates a users deck', async () => {
    const [agent] = await registerAndLogin();
    const sendDeck = await agent.post('/api/v1/decks/create').send(testDeck);
    expect(sendDeck.status).toBe(200);

    const response = await agent
      .put(`/api/v1/decks/${sendDeck.body.id}`)
      .send({ name: 'Ninja Deck' });

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual('Ninja Deck');
  });

  it('#DELETE /api/v1/decks/:id deletes a users deck', async () => {
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

  // it.only('#POST should copy a deck', async () => {
  //   const [agent, user] = await registerAndLogin();
  //   const deckToCopy = await agent.post('/api/v1/decks/create').send(testDeck);
  //   expect(deckToCopy.status).toBe(200);
  //   expect(deckToCopy.body).toEqual({
  //     id: expect.any(String),
  //     uid: user.id,
  //     ...testDeck,
  //   });
  //   const copiedDeck = await agent.post('/api/v1/decks/create').send(emptyDeck);
  //   expect(copiedDeck.status).toBe(200);

  //   const copy = await agent.post(`/api/v1/decks/${deckToCopy.body.id}/${copiedDeck.body.id}`);
  //   expect(copy.status).toBe(200);

  // WIP
  // });

  afterAll(() => {
    pool.end();
  });
});
