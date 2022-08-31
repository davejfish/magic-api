const { Router } = require('express');
const { response } = require('../app');
const authenticate = require('../middleware/authenticate');
const Card = require('../models/cards');
const { fetchCards } = require('../services/cardService');

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
  .post('/add/:deckID', authenticate, async (req, res, next) => {
    try {
      console.log('req.body: ', req.body);
      
      const data = {
        identifiers: []
      };
      
      for (const card of req.body) {
        data.identifiers.push(card);
      }
      
      const cards = await fetchCards(data);
      

      res.json({});
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
