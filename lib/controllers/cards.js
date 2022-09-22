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
  // this feels like it belongs in the decks controller
  // /api/v1/decks/:deckID/add
  .post('/add/:deckID', authenticate, authorize, async (req, res, next) => {
    try {
      // i think you can simplify here
      const data = {
        identifiers: req.body,
      };

      const cards = await fetchCards(data);

      // this is a good use case for .map with an index
      const items = cards.data.map((card, index) => {
        return {
          uid: req.user.id,
          deck_id: req.params.deckID,
          sk_id: card.id,
          type_line: card.type_line,
          name: card.name,
          sideboard: req.body[index].sideboard
            ? req.body[index].sideboard
            : false,
        };
      });

      const response = await Card.bulkInsert(items);

      const deck = await Deck.getByID(req.params.deckID);
      // you're checking the rules here, but you're not doing anything
      // with the repsonse -- I would maybe add it to the response here
      const legal = await checkRules(deck);

      res.json({ response, legal });
    } catch (e) {
      next(e);
    }
  })
  .delete('/:skID/:deckID', authenticate, authorize, async (req, res, next) => {
    try {
      const data = await Card.deleteFromDeck(
        req.params.skID,
        req.params.deckID
      );
      res.json(data);
    } catch (e) {
      next(e);
    }
  })
  // this feels like it belongs in the decks controller
  // DELETE api/v1/decks/:id/cards (or something)
  .delete('/:deckID', authenticate, authorize, async (req, res, next) => {
    try {
      const data = await Card.deleteAllFromDeck(req.params.deckID);
      res.json(data);
    } catch (e) {
      next(e);
    }
  });
