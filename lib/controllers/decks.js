const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const Deck = require('../models/deck');
const DeckService = require('../services/DeckService');

module.exports = Router()
  .get('/user-decks', authenticate, async (req, res, next) => {
    try {
      const response = await DeckService.getAllDecksByID(req.user.id);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .get('/decks-cards/:id', authenticate, authorize, async (req, res, next) => {
    try {
      const response = await DeckService.getDeckWithCards(req.params.id);
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
  .put('/:id', authenticate, authorize, async (req, res, next) => {
    try {
      const response = await DeckService.updateByID(req.params.id, req.body);
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
  .delete('/:id', authenticate, authorize, async (req, res, next) => {
    try {
      const response = await DeckService.deleteByID(req.params.id);
      res.json(response);
    } catch (e) {
      next(e);
    }
  });
