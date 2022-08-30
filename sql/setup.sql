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



INSERT INTO mtg_cards
(sk_id, name, type_line, 
oracle_text, image_uri, mana_cost, 
cmc, colors, legalities, set_name, prices)
VALUES
('142c5b67-5de9-41da-b57f-7ce771457a3e', 'Ascendant Packleader', 'Creature — Wolf', 'Ascendant Packleader enters the battlefield with a +1/+1 counter on it if you control a permanent with mana value 4 or greater.
Whenever you cast a spell with mana value 4 or greater, put a +1/+1 counter on Ascendant Packleader.', '{"standard":"legal","future":"legal","historic":"legal","gladiator":"legal","pioneer":"legal","explorer":"legal","modern":"legal","legacy":"legal","pauper":"not_legal","vintage":"legal","penny":"not_legal","commander":"legal","brawl":"legal","historicbrawl":"legal","alchemy":"legal","paupercommander":"not_legal","duel":"legal","oldschool":"not_legal","premodern":"not_legal"}', '{G}',
'1', '{"G"}', '{"standard":"legal","future":"legal","historic":"legal","gladiator":"legal","pioneer":"legal","explorer":"legal","modern":"legal","legacy":"legal","pauper":"not_legal","vintage":"legal","penny":"not_legal","commander":"legal","brawl":"legal","historicbrawl":"legal","alchemy":"legal","paupercommander":"not_legal","duel":"legal","oldschool":"not_legal","premodern":"not_legal"}', 'Innistrad: Crimson Vow', '{"usd":"0.55","usd_foil":"0.65","usd_etched":null,"eur":"0.75","eur_foil":"0.50","tix":"0.14"}'),
('test2', 'test2', 'test2', 'test2', 'test2', 'test2',
'test2', 'test2', 'test2', 'test2', 'test2');

INSERT INTO decks
(uid, rule_set, name, legal)
VALUES
('1', 'standard', 'daves deck', true);

INSERT INTO decks_cards
(uid, sk_id, deck_id, sideboard)
VALUES
('1', '142c5b67-5de9-41da-b57f-7ce771457a3e', '1', false),
('1', 'test2', '1', false),
('1', '142c5b67-5de9-41da-b57f-7ce771457a3e', '1', false);


