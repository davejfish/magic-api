const pool = require('../utils/pool');


module.exports = class Deck {
  id;
  uid;
  rule_set;
  name;

  constructor({ id, uid, rule_set, name }) {
    this.id = id;
    this.uid = uid;
    this.rule_set = rule_set;
    this.name = name;
  }

  static async insert({ rule_set, name }, uid) {
    const { rows } = await pool.query(`
      INSERT INTO decks
      (uid, rule_set, name)
      VALUES ($1, $2, $3)
      RETURNING *`, [uid, rule_set, name]);
    return new Deck(rows[0]);
  }

  static async getAllByID(id) {
    const { rows } = await pool.query(`
      SELECT * FROM decks
      WHERE uid = $1`, [id]);
    if (!rows[0]) return null;
    return rows.map(row => new Deck(row));
  }
};
