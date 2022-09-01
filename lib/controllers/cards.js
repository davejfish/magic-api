const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const Card = require('../models/cards');
const Deck = require('../models/deck');
const { fetchCards } = require('../services/cardService');
const { checkRules } = require('../utils/utils');

module.exports = Router()
  .get('/:id', async (req, res, next) => {
    try {
      const response = await Card.getByID(req.params.id);
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .post('/add/:deckID', authenticate, authorize, async (req, res, next) => {
    try {
      const data = {
        identifiers: []
      };
      
      for (const card of req.body) {
        data.identifiers.push(card);
      }
      
      const cards = await fetchCards(data);
      const items = [];
      for (const card of cards.data) {
        const props = {
          uid: req.user.id,
          deck_id: req.params.deckID,
          sk_id: card.id,
          type_line: card.type_line,
          name: card.name,
        };
        items.push(props);
      }
      
      const response = await Card.insertIntoDB(items);

      const deck = await Deck.getByID(req.params.deckID);
      await checkRules(deck);
     
      res.json(response);
    } catch (e) {
      next(e);
    }
  })
  .delete('/:skID/:deckID', authenticate, authorize, async (req, res, next) => {
    try {
      const data = await Card.deleteFromDeck(req.params.skID, req.params.deckID);
      res.json(data);
    } catch(e) {
      next(e);
    }
  })
  .delete('/:deckID', authenticate, authorize, async (req, res, next) => {
    try {
      const data = await Card.deleteAllFromDeck(req.params.deckID);
      res.json(data);
    } catch(e) {
      next(e);
    }
  })

;
