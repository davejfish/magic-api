const Deck = require('../models/deck');
const { fetchCards } = require('./cardService');

module.exports = class DeckService {
  static async create(params, uid) {
    const newDeck = await Deck.insert(params, uid);
    return newDeck;
  }

  static async getDeckWithCards(id) {
    const response = await Deck.getDeckWithCards(id);
    const data = {
      identifiers: []
    };
    
    for (const card of response) {
      data.identifiers.push({ id: card.sk_id });
    }

    const cards = await fetchCards(data);
    return cards.data;
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
  static async deleteByID(id) {
    const response = await Deck.deleteByID(id);
    return response;
  }
};
