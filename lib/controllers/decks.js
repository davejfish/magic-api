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
  .get('/user-decks', authenticate, async (req, res, next) => {
    try {
      const response = await DeckService.getAllDecksByID(req.user.id);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
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
  .get('/', async (req, res, next) => {
    try {
      const response = await DeckService.getAll();
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .post('/create', authenticate, async (req, res, next) => {
    try {
      const response = await DeckService.create(req.body, req.user.id);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .put('/:deckID', authenticate, authorize, async (req, res, next) => {
    try {
      const response = await DeckService.updateByID(req.params.deckID, req.body);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .post('/:copyID/:deckID', authenticate, async (req, res, next) => {
    try {
      const response = await Deck.copyDeck(req.params.copyID, req.body.user.id, req.params.deckID);
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
