const Deck = require('../models/deck');

module.exports = class DeckService {

  static async create(params, uid) {
    const newDeck = await Deck.insert(params, uid);
    return newDeck;
  }
};
