const pool = require('../utils/pool');

module.exports = class Deck {
  id;
  uid;
  rule_set;
  name;
  legal;

  constructor({ id, uid, rule_set, name, legal }) {
    this.id = id;
    this.uid = uid;
    this.rule_set = rule_set;
    this.name = name;
    this.legal = legal;
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
};
