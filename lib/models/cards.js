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
    prices}) {
    const { rows } = await pool.query(`
    insert into 
    `)
  }
};
