const pool = require('../utils/pool');

module.exports = class Deck {
  id;
  uid;
  rule_set;
  name;
  sideboard;
  legal;

  constructor({ id, uid, rule_set, name, sideboard, legal, cards }) {
    this.id = id;
    this.uid = uid;
    this.rule_set = rule_set;
    this.name = name;
    this.sideboard = sideboard;
    this.legal = legal;
    if (cards) this.cards = cards;
  }

  static async insert({ rule_set, name, legal = false }, uid) {
    const { rows } = await pool.query(
      `
      INSERT INTO decks
      (uid, rule_set, name, legal)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [uid, rule_set, name, legal]
    );
    return new Deck(rows[0]);
  }

  static async getAllByID(id) {
    const { rows } = await pool.query(
      `
      SELECT * FROM decks
      WHERE uid = $1`,
      [id]
    );
    if (!rows[0]) return null;
    return rows.map((row) => new Deck(row));
  }

  static async getByID(id) {
    const { rows } = await pool.query(
      `
    SELECT * FROM decks
    WHERE id = $1`,
      [id]
    );
    if (!rows[0]) return null;
    return new Deck(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(`
    SELECT * FROM decks`);
    if (!rows[0]) return null;
    return rows.map((row) => new Deck(row));
  }

  static async updateByID(id, data) {
    const oldData = await Deck.getByID(id);
    const newData = {
      ...oldData,
      ...data,
    };
    const { rows } = await pool.query(
      `
      UPDATE decks
      SET uid = $1, rule_set = $2, name = $3, legal = $4
      WHERE id = $5
      RETURNING *`,
      [newData.uid, newData.rule_set, newData.name, newData.legal, id]
    );
    return new Deck(rows[0]);
  }

  static async deleteByID(id) {
    const { rows } = await pool.query(
      `
      DELETE FROM decks
      WHERE id = $1
      RETURNING *`,
      [id]
    );
    return new Deck(rows[0]);
  }

  static async getDeckWithCards(id) {
    const { rows } = await pool.query(`
    SELECT * FROM decks_cards
    WHERE decks_cards.deck_id=$1`, [id]);
    return rows;
  }
  
  static async getCardCount(deckId) {
    const { rows } = await pool.query(
      `select decks_cards.sk_id, decks_cards.name, decks_cards.sideboard, 
      decks_cards.type_line, count(decks_cards.sk_id) as quantity
      from decks_cards
      WHERE decks_cards.deck_id = $1
      group by decks_cards.sk_id, decks_cards.name, decks_cards.sideboard, decks_cards.type_line
      order by quantity desc, sk_id`, 
      [deckId]
    );
    return rows;
  }

  // static async copyDeck(deckToCopy, uid, deckID) {
  //   const rows = await pool.query(
  //     ` INSERT INTO decks_cards VALUES (uid, deck_id, sk_id, sideboard)
  //     VALUES (SELECT (sk_id, sideboard), $2, $3)
  //     FROM decks_cards
  //     WHERE decks_cards.deck_id = $1
  // WIP
  //     `,
  //     [deckToCopy, uid, deckID]
  //   );
  //   return rows[0];
  // }

};


