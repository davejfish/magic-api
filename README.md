# Project Summary for MTG Deckbuilder v.1

This project is meant to explore data relationships when pulling from an api through the process  
of users creating decks of magic cards. In theory it could also extend the ability to build and  
store decks to third party fan sites for specific formats who connect to our backend.

This v.1 prototype was built by a team of developers over the course of a week using Agile  
methodology.

## H2 The Team

Dave Fisher
[github](https://github.com/davejfish)
Maxwill Winters
[github](https://github.com/Aphenphos)
Zachary Piontek
[github](https://github.com/Zachary-Piontek)
Shan Hathaway
[github](https://github.com/Hathaway-Shan)

You can find our Miro planning board for the project [here](https://miro.com/app/board/uXjVPcb5WGc=/?share_link_id=389695925399)

## H2 Tech Stack

This project is written using Express Js and uses a Postgress Database to store user, deck, and  
card info on SQL tables.

## H2 Basic Functionality

- Create a user Account
- Sign in an existing user
- Users can log out
- Users can create and store decks as objects associated with their account
- Users can view all of their decks via a protected route
- Users are Authorized to delete a deck by id
- Users can view all the cards in a deck by id
- Each deck object should be publically viewable by id so they can be shared
- Editing the cards in a deck should be an authorized route so only its creator can add or remove  
   cards.
- Cards should be added to decks by hitting the <https://api.scryfall.com/cards/collection> with  
   a fetch and post method and return card values.
- The return values should be reformatted by utils functions and then passed and inserted to the  
   Card model to be inserted in the SQL database.
- A users deck should be run through a switch case function to check for card legality by format  
   and whether or not a deck contains an illegal number of cards for that format.
- Users should be able to delete all the cards in a deck without deleting the deck if they want.

## H2 Highlighted Features

These features are meant to highlight core bits of the codes functionality beyond the basics of  
Authentication, Authorization, and basic CRUD routes. Anyone looking to maintain or expand upon  
the v.1 version of this repo should make sure they understand these parts of the code in order to  
modify or maintain core functionality.

## H3 Bulk Insert

All cards are added to decks in this api by hitting the <https://api.scryfall.com/cards/collection> endpoint.  
Which allows a post of up to 75 identifiers and returns two arrays, one containing all  
the cards with matched identifiers, and one containing all the identifiers that failed to match.  
To learn more about the specifics of this check out the [Scryfall API docs](https://scryfall.com/docs/api/cards/collection).

## H3 Shaping The Data

The api.scryfall.com/cards/collection endpoint only accepts post data of a particular shape using  
"identifiers":

```js
{
  "identifiers": [
    {
      "id": "683a5707-cddb-494d-9b41-51b4584ded69"
    },
    {
      "name": "Ancient Tomb"
    },
    {
      "set": "mrd",
      "collector_number": "150"
    }
  ]
}
```

Each submitted card identifier must be a JSON object with one or more of the keys id, mtgo_id,  
multiverse_id, oracle_id, illustration_id, name, set, and collector_number.

In order to meet this requirement we need to reshape the data of our query in order to return the  
data of the requested cards and add it to a join table with a foreign key pairing referencing a  
user decks by id, so that basic CRUD operations can be performed on the contents of a deck. This  
is taken care of on v.1 by our buildQuery function located and exported from utils.js.

```js
const buildQuery = (data) => {
  //we take in the data from the req.body and assign it a variable of totalItems
  const totalItems = data.length;
  let valueString = '';
  const arr = [];
  let i = 0;
  //we set i = 0 to help shape the data further down

  data.map((card, j) => {
    //using the automatic indexing of the map function in JS we add an extra argument
    //of j to increment along with the index using backticks and template literals we
    //shape the data of the req.body into the accepted shape for the api
    const string = `(
    ${`$${i + 1}`}, 
    ${`$${i + 2}`}, 
    ${`$${i + 3}`}, 
    ${`$${i + 4}`}, 
    ${`$${i + 5}`}, 
    ${`$${i + 6}`}), `;
    //the last two symbols the comma and backtick will cause a bad request if they
    //are part of the final post to the Api

    valueString += string;

    if (j + 1 === totalItems) valueString = valueString.slice(0, -2);
    //Using j + 1 we can make sure we have mapped the the entire request into a new array of
    //object we then slice off the comma and backtick
    arr.push(
      card.uid, //user id
      card.deck_id, //deck id
      card.sk_id, //the scryfall id aliased for our tables
      card.type_line, //the card types used to screen for cards exempt for cards that break the
      //no  more than 4 constraint
      card.name, //the name of the card
      card.sideboard // a boolean value to separate main deck cards from sideboard cards
    );
    //these are the basic values we use to build all data relationships in the v.1 prototype
    i += 6;
  });
  return [valueString, arr];
};
```

## H3 The Rules Check Switch Case

Magic the Gathering as a game has many constraints around deck building rules. In this v.1  
prototype we have chosen to only handle the ones based upon the Standard format. This means:

1. All cards must come from standard legal sets.
2. Decks are made up of a 60 card main deck and a 15 card sideboard.
3. A deck and sideboard cannot contain more than 4 copies of a single card.
4. Basic lands are an exception to the no more than 4 copies rule, a deck can contain any number  
   of basics.

In terms of how this is handled in the code we use a large switch case function that checks for  
these conditions and pushes any card that violates them into an array the user can view  
to inform their editing choices and bring decks into format legal compliance.

```js
const checkRules = async ({ rule_set, id, legal }) => {
  const arr = [];
  let deckCards = 0;
  let sbCards = 0;
  //here we create an empty array and declare variables setting main and sideboard cards equal to 0
  switch (rule_set) {
    case 'standard': {
      const cards = await Deck.getCardCount(id);

      for (const card of cards) {
        const strings = card.type_line.split(' ');
        // since the "basic" property for lands breaking the no more than 4 constraint is a string
        //inside of the data object we pull down from scryfall we have to use the split method on
        //the type line in order to check for it
        let boolean = null;
        for (const string of strings) {
          if (string === 'Basic') {
            boolean = true;
            break;
          } else {
            boolean = false;
          }
        }
        //we loop through the cards and any with the string value basic are given the boolean property 'true'
        if (card.quantity > 4 && !boolean) {
          arr.push({ name: card.name, quantity: card.quantity });
        }
        //here we enter the switch case conditionals which check for the standard deck building constraints
        //any car that violates the constraints is pushed into an object array which can be viewed at the
        // decks/:id/legal endpoint
        if (card.sideboard) {
          sbCards += Number(card.quantity);
        } else {
          deckCards += Number(card.quantity);
        }
        //here we increment the main and sideboard count to check that the main deck contains 60 cards
        // and the sideboard contains 15
      }
      const totalCards = deckCards + sbCards;
      if (deckCards > 60) {
        arr.push({ message: 'Only 60 cards allowed per deck.' });
      }
      if (sbCards > 15) {
        arr.push({ message: 'Only 15 sideboard cards allowed per deck.' });
      }
      if (totalCards > 75) {
        arr.push({
          message: 'Only 75 total cards allowed per deck with sideboard cards.',
        });
      }
      // depending on what deck building constraint your deck breaks a message will be added

      if (arr.length >= 1) {
        if (legal) await Deck.updateByID(id, { legal: false });
        return arr;
      }

      if (!legal) await Deck.updateByID(id, { legal: true });
      //inside this final conditional we check the array and if any errors have been pushed into it
      //the deck is marked illegal until standard rule conditions are met.
      return true;
    }
    default:
      null;
  }
};
```

These are the main features to keep in mind when working with or expanding upon this backend. It is our  
<<<<<<< HEAD
hoe that this project adds some small new functionality to the mtg community and that ultimately  
some small corners of that community might even find it useful.
=======
new functionality to the mtg community and that ultimately some small corners of that community might  
find it useful.
>>>>>>> 7857d3fd50b16ca39303f88365b120dc3ab2b05f
