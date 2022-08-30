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
  .post('/addCard/:deckID', authenticate, async (req, res, next) => {
    try {
      let card = await Card.getByID(req.body.card.id);
      if (!card)
        card = await Card.insertIntoDB(req.body.card);
      const response = await Card.addToDeck(req.user.id, req.params.deckID, card.sk_id, req.body.sideboard);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .delete('/:skID/:deckID', authenticate, async (req, res, next) => {
    try {
      const data = await Card.deleteFromDeck(req.params.skID, req.params.deckID);
      res.json(data);
    } catch(e) {
      next(e);
    }
  })

;
