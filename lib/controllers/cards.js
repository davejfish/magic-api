const { Router, response } = require('express');
const authenticate = require('../middleware/authenticate');
const Card = require('../models/cards');

module.exports = Router()
//unsure if we need this maybe just to scroll through some cards?
  .get('/:id', async (req, res, next) => {
    try {
      const response = await Card.getByID(req.params.id);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const response = await Card.getAll();
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .post('/:id', async (req, res, next) => {
    try {
      const resp = await Card.addToDeck(req.body.deckId, req.params.id, req.body.isSideboard)
      res.json(resp);
    } catch (e) {
      next(e);
    }
  })
;
