-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS mtg_cards;
DROP TABLE IF EXISTS sideboards;
DROP TABLE IF EXISTS decks;
DROP TABLE IF EXISTS mtg_users;

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
  FOREIGN KEY (uid) REFERENCES mtg_users(id)
);

CREATE TABLE sideboards (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  deck_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  FOREIGN KEY (deck_id) REFERENCES decks(id),
  FOREIGN KEY (user_id) REFERENCES mtg_users(id)
);

CREATE TABLE mtg_cards (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  deck_id BIGINT,
  sideboard_id BIGINT,
  name TEXT NOT NULL,
  type_line TEXT,
  oracle_text TEXT,
  image_uri TEXT,
  mana_cost TEXT,
  cmc TEXT,
  colors TEXT,
  legalities TEXT,
  set_name TEXT,
  prices TEXT,
  FOREIGN KEY (deck_id) REFERENCES decks(id),
  FOREIGN KEY (sideboard_id) REFERENCES sideboards(id)
);

INSERT INTO mtg_users
(email, passwordhash)
VALUES
('fish@test.com', '$2b$10$/XLQ2NtgPH0ZWknA46v44uXryhWfvZR4qXWgx70eNhc4kvMpTKXJK');