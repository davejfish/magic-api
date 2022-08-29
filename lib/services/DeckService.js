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

  static async getAll() {
    const response = await Deck.getAll();
    return response;
  }

  static async getByID(id) {
    const response = await Deck.getByID(id);
    return response;
  }
  static async updateByID(id, data) {
    const response = await Deck.updateByID(id, data);
    return response;
  }
};
