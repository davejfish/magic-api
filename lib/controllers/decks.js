const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const Deck = require('../models/deck');
const DeckService = require('../services/DeckService');
const { checkRules } = require('../utils/utils');

module.exports = Router()
  .get('/:deckID/legal', authenticate, async (req, res, next) => {
    try {
      const deck = await DeckService.getByID(req.params.deckID);
      const response = await checkRules(deck);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  // this could probably be part of the users controller
  // GET api/v1/users/:id/decks
  .get('/user-decks', authenticate, async (req, res, next) => {
    try {
      const response = await DeckService.getAllDecksByID(req.user.id);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  // to be RESTFUL this could be
  // GET /api/v1/decks/:id/cards
  .get('/decks-cards/:deckID', authenticate, async (req, res, next) => {
    try {
      const response = await DeckService.getDeckWithCards(req.params.deckID);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const response = await DeckService.getByID(req.params.id);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  // should this be authenticated or authorized?
  .get('/', async (req, res, next) => {
    try {
      const response = await DeckService.getAll();
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  // with REST routes the convention for create is POST to the index
  .post('/', authenticate, async (req, res, next) => {
    try {
      const response = await DeckService.create(req.body, req.user.id);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .put('/:deckID', authenticate, authorize, async (req, res, next) => {
    try {
      const response = await DeckService.updateByID(
        req.params.deckID,
        req.body
      );
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  // i would maybe make this
  // POST /api/v1/decsks/:id/copy/:copyID
  .post('/:copyID/:deckID', authenticate, async (req, res, next) => {
    try {
      const response = await Deck.copyDeck(
        req.params.copyID,
        req.body.user.id,
        req.params.deckID
      );
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .delete('/:deckID', authenticate, authorize, async (req, res, next) => {
    try {
      const response = await DeckService.deleteByID(req.params.deckID);
      res.json(response);
    } catch (e) {
      next(e);
    }
  });
