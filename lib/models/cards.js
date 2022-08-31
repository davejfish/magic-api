const pool = require('../utils/pool');
const { buildQuery } = require('../utils/utils');
const Deck = require('./deck.js');

module.exports = class Card {
  
  static async insertIntoDB(data) {
    const [valueString, arr] = buildQuery(data);
    const { rows } = await pool.query(
      `
      INSERT INTO decks_cards
      (uid, deck_id, sk_id, image_uris, name)
      VALUES 
      ${valueString}
      RETURNING *
      `, arr);

    if (!rows[0]) return null;
    return rows;
  }

  static async getByID(sk_id) {
    const { rows } = await pool.query(
      `
    SELECT * FROM mtg_cards
    WHERE sk_id = $1`,
      [sk_id]
    );
    if (!rows[0]) return null;
    return new Card(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(`
    SELECT * FROM mtg_cards`);
    if (!rows[0]) return null;
    return rows.map((row) => new Card(row));
  }

  static async addToDeck(uid, deckID, skID, isSideboard) {
    const { rows } = await pool.query(
      `INSERT INTO decks_cards (uid, deck_id, sk_id, sideboard)
        VALUES ($1, $2, $3, $4) returning *`,
      [uid, deckID, skID, isSideboard]
    );
    return rows[0];
  }

  static async deleteFromDeck(sk_id, deck_id) {
    const { rows } = await pool.query(
      `
        DELETE from decks_cards
        WHERE sk_id=$1 AND deck_id=$2
        RETURNING *
        `,
      [sk_id, deck_id]
    );
    return new Deck(rows[0]);
  }
};
