const pool = require('../utils/pool');
const Deck = require('./deck.js');


module.exports = class Card {
  card_id;
  sk_id;
  name;
  type_line;
  oracle;
  image_uri;
  mana_cost;
  cmc;
  colors;
  legalities;
  set_name;
  prices;

  constructor({
    card_id, 
    sk_id, 
    name, 
    type_line, 
    oracle, 
    image_uri, 
    mana_cost, 
    cmc, 
    colors,
    legalities,
    set_name,
    prices
  })
  {
    this.card_id = card_id;
    this.sk_id = sk_id;
    this.name = name;
    this.type_line = type_line;
    this.oracle = oracle;
    this.image_uri = image_uri;
    this.mana_cost = mana_cost;
    this.cmc  = cmc;
    this.colors = colors;
    this.legalities = legalities;
    this.set_name = set_name;
    this.prices = prices;
  }

  static async insertIntoDB({
    id, 
    name, 
    type_line, 
    oracle_text, 
    image_uri, 
    mana_cost, 
    cmc, 
    colors,
    legalities,
    set_name,
    prices
  }) {
    const { rows } = await pool.query(`
    INSERT INTO mtg_cards (
        sk_id, 
        name, 
        type_line, 
        oracle_text, 
        image_uri, 
        mana_cost, 
        cmc, 
        colors,
        legalities,
        set_name,
        prices
    ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
    ) RETURNING * `, 
    [
      id, 
      name, 
      type_line, 
      oracle_text, 
      image_uri, 
      mana_cost, 
      cmc, 
      colors,
      legalities,
      set_name,
      prices
    ]);
    if (!rows[0]) return null;
    return new Card(rows[0]);
  }

  static async getByID(sk_id) {
    const { rows } = await pool.query(`
    SELECT * FROM mtg_cards
    WHERE sk_id = $1`, [sk_id]);
    if (!rows[0]) return null;
    return new Card(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(`
    SELECT * FROM mtg_cards`
    );
    if (!rows[0]) return null;
    return rows.map(row => new Card(row));
  }

  static async addToDeck(uid, deckID, skID, isSideboard) {
    const { rows } =
    await pool.query(
      `INSERT INTO decks_cards (uid, deck_id, sk_id, sideboard)
        VALUES ($1, $2, $3, $4) returning *`,
      [uid, deckID, skID, isSideboard]
    );
    return rows[0];
  }

  static async deleteFromDeck(sk_id, deck_id) {
    const { rows } = await pool.query (
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






