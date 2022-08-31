const { Router } = require('express');
const { response } = require('../app');
const authenticate = require('../middleware/authenticate');
const Card = require('../models/cards');
const Deck = require('../models/deck');
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
          image_uris: card.image_uris.small,
          name: card.name,
        };
        items.push(props);
      }
      
      const response = await Card.insertIntoDB(items);
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
