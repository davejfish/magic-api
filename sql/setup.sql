-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`

DROP TABLE IF EXISTS mtg_users CASCADE;
DROP TABLE IF EXISTS decks CASCADE;
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
  card_name TEXT,
  legal BOOLEAN,
  FOREIGN KEY (uid) REFERENCES mtg_users(id)
);

CREATE TABLE decks_cards (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  uid BIGINT NOT NULL,
  deck_id BIGINT NOT NULL,
  sk_id varchar NOT NULL,
  name text NOT NULL,
  sideboard BOOLEAN NOT NULL DEFAULT 'false',
  FOREIGN KEY (deck_id) REFERENCES decks(id)
);

INSERT INTO mtg_users
(email, passwordhash)
VALUES
('fish@test.com', '$2b$10$/XLQ2NtgPH0ZWknA46v44uXryhWfvZR4qXWgx70eNhc4kvMpTKXJK');

INSERT INTO decks
(uid, rule_set, name, legal)
VALUES
('1', 'standard', 'indebted samurai super deck', 'true');
