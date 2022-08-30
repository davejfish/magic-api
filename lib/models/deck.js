const pool = require('../utils/pool');

module.exports = class Deck {
  id;
  uid;
  rule_set;
  name;
  legal;

  constructor({ id, uid, rule_set, name, legal, cards }) {
    this.id = id;
    this.uid = uid;
    this.rule_set = rule_set;
    this.name = name;
    this.legal = legal;
    if (cards) this.cards = cards;
  }

  static async insert({ rule_set, name, legal }, uid) {
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
      SELECT decks.*,
      COALESCE(
        json_agg(json_build_object(
          'card_id', mtg_cards.card_id,
          'sk_id', mtg_cards.sk_id,
          'name', mtg_cards.name,
          'type_line', mtg_cards.type_line,
          'oracle_text', mtg_cards.oracle_text,
          'image_uri', mtg_cards.image_uri,
          'mana_cost', mtg_cards.mana_cost,
          'cmc', mtg_cards.cmc,
          'colors', mtg_cards.colors,
          'legalities', mtg_cards.legalities,
          'set_name', mtg_cards.set_name,
          'prices', mtg_cards.prices
          ))
        FILTER (WHERE decks_cards IS NOT NULL), '[]'
      ) AS cards
      FROM decks
      JOIN decks_cards ON decks.id = decks_cards.deck_id
      JOIN mtg_cards ON decks_cards.sk_id = mtg_cards.sk_id
      WHERE decks.id = $1
      GROUP BY decks.id`, [id]);

    return new Deck(rows[0]);
  }
};
