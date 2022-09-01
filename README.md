# Project Summary for MTG Deckbuilder v.1

This project is meant to explore data relationships when pulling from an api through the process of users creating decks of magic cards. In theory it could also extend the ability to build and store decks to third party fan sites for specific formats who connect to our backend.

This v.1 prototype was built by a team of developers over the course of a week using Agile methodology.

## H2 The Team

Dave Fisher:

Maxwill Winters:

Zachary Piontek:

Shan Hathaway:

## H2 Tech Stack

This project is written using Express Js and uses a Postgress Database to store user, deck, and card info on SQL tables.

## H2 Highlighted Features

1. Create a user Account
2. Sign in an existing user
3. Users can log out
4. Users can create and store decks as objects associated with their account
5. Users can view all of their decks via a protected route
6. Users are Authorized to delete a deck by id
7. Users can view all the cards in a deck by id
8. Each deck object should be publically viewable by id so they can be shared
9. Editing the cards in a deck should be an authorized route so only its creator can add or remove cards.
10. Cards should be added to decks by hitting the <https://api.scryfall.com/cards/collection> with a fetch and post method and return card values.
11. The return values should be reformatted by utils functions and then passed and inserted to the Card model to be inserted in the SQL database.
12. A users deck should be run through a switch case function to check for card legality by format and whether or not a deck contains an illegal number of cards for that format.
13. Users should be able to delete all the cards in a deck without deleting the deck if they want.
