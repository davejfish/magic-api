const pool = require("../utils/pool");


module.exports = class Card {
  id;
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
    id, 
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
  }) {
    this.id  = id;
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

  static async insert({         
    id, 
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
  }) {
    const { rows } = await pool.query(`
    INSERT INTO mtg_cards (
        id, 
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
    ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
    ) RETURNING * `, 
    [
      id, 
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
    ]);
    if (!rows[0]) return null;
    return new Card(rows[0]);
  }

  static async getByID(id) {
    const { rows } = await pool.query(`
    SELECT * FROM mtg_cards
    WHERE id = $1`, [id]);
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

  static async addToDeck(deck, isSideboard) {
    await pool.query(
      `INSERT INTO decks_cards (deck_id, sk_id, sideboard)
        VALUES ($1, $2, $3) returning *`,
      [deck, this.id, isSideboard]
    );

  }
};




