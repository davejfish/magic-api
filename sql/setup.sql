-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS mtg_users CASCADE;
DROP TABLE IF EXISTS decks CASCADE;
DROP TABLE IF EXISTS mtg_cards CASCADE;
DROP TABLE IF EXISTS decks_cards CASCADE;


CREATE TABLE mtg_users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT,
  email TEXT NOT NULL,
  passwordhash TEXT NOT NULL
);

CREATE TABLE decks (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  uid BIGINT NOT NULL,
  rule_set TEXT NOT NULL,
  name TEXT,
  legal BOOLEAN,
  FOREIGN KEY (uid) REFERENCES mtg_users(id)
);

CREATE TABLE mtg_cards (
  card_id BIGINT GENERATED ALWAYS AS IDENTITY,
  sk_id varchar not null PRIMARY KEY,
  name TEXT NOT NULL,
  type_line TEXT,
  oracle_text TEXT,
  image_uri TEXT,
  mana_cost TEXT,
  cmc TEXT,
  colors TEXT,
  legalities TEXT,
  set_name TEXT,
  prices TEXT
);

CREATE TABLE decks_cards (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  uid BIGINT NOT NULL,
  sk_id varchar NOT NULL,
  deck_id BIGINT NOT NULL,
  sideboard BOOLEAN NOT NULL,
  FOREIGN KEY (sk_id) REFERENCES mtg_cards(sk_id),
  FOREIGN KEY (deck_id) REFERENCES decks(id)
);

INSERT INTO mtg_users
(email, passwordhash)
VALUES
('fish@test.com', '$2b$10$/XLQ2NtgPH0ZWknA46v44uXryhWfvZR4qXWgx70eNhc4kvMpTKXJK');

-- INSERT INTO mtg_cards 
-- (sk_id, name, type_line, oracle_text, image_uri, mana_cost, cmc, colors, legalities, set_name, prices)
-- VALUES
-- ('142c5b67-5de9-41da-b57f-7ce771457a3e', 'Ascendant Packleader, ')
