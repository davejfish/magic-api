const { Router, response } = require('express');
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
      const response = await Deck.updateByID(req.params.id, req.body);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })

  .post('/id/:cardId', authenticate, async (req, res, next) => {
    try {
      const resp = await getByCardId.get(req.params.cardId, req.user.id);
      if (!resp) {
        // fetch from api
        // insert card
      } else {
        res.json(resp);
      }
    } catch (e) {
      next(e);
    }
  });
