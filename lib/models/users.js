const pool = require('../utils/pool');
const jwt = require('jsonwebtoken');

module.exports = class User {
  id;
  username;
  email;
  #passwordhash;

  constructor({ id, username, email, passwordhash }) {
    this.id = id;
    this.username = username ? username : null;
    this.email = email;
    this.#passwordhash = passwordhash;
  }

  static async create({ username = null, email, passwordhash}) {
    const { rows } = await pool.query(`
      INSERT INTO mtg_users
      (username, email, passwordhash)
      VALUES ($1, $2, $3)
      RETURNING *`, [username, email, passwordhash]);
    return new User(rows[0]);
  }

  static async signIn(user) {
    const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: '1 day',
    });
    return token;
  }

  static async getByEmail(email) {
    const { rows } = await pool.query(`
      SELECT * FROM mtg_users
      WHERE email = $1`, [email]);
    if (!rows[0]) return null;
    return new User(rows[0]);
  }
};
