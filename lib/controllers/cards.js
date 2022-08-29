const { Router } = require('express');
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
  .post('/addCard/:deckID', authenticate, async (req, res, next) => {
    try {
      let card = await Card.getByID(req.body.id);
      
      if (!card)
        card = await Card.insertIntoDB(req.body);
      const response = await Card.addToDeck(req.user.id, req.params.deckID, card.sk_id, true);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .post('/:id', async (req, res, next) => {
    try {
      const resp = await Card.addToDeck(req.body.deckId, req.params.id, req.body.isSideboard);
      res.json(resp);
    } catch (e) {
      next(e);
    }
  })
  .delete('/:id', authenticate, async (req, res, next) => {
    try {
      const data = await Card.delete(req.body.sk_id);
      res.json(data);
    } catch(e) {
      next(e);
    }
  })

;
