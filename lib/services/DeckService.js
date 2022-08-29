const Deck = require('../models/deck');

module.exports = class DeckService {

  static async create(params, uid) {
    const newDeck = await Deck.insert(params, uid);
    return newDeck;
  }

  static async getAllDecksByID(id) {
    const response = await Deck.getAllByID(id);
    return response;
  }
};
