const Deck = require('../models/deck.js');

const checkRules = async ({ rule_set, id }) => {
  const arr = [];
  let deckCards = 0;
  let sbCards = 0;
  switch(rule_set) {
    case 'standard': {
      const cards = await Deck.getCardCount(id);

      for (const card of cards) {
        if(card.quantity > 4) {
          arr.push({ name: card.name, quantity: card.quantity });
        }
        if (card.sideboard) {
          sbCards += Number(card.quantity);
        } else {
          deckCards += Number(card.quantity);
        }
      }
      const totalCards = deckCards + sbCards;
      if (deckCards > 60) {
        arr.push({ message: 'Only 60 cards allowed per deck.' });
      } 
      if (sbCards > 15) {
        arr.push({ message: 'Only 15 sideboard cards allowed per deck.' });
      }
      if (totalCards > 75) {
        arr.push({ message: 'Only 75 total cards allowed per deck with sideboard cards.' });
      } 
      if (arr.length >= 1) {
        await Deck.updateByID(id, { legal: false });
        return arr;
      } 
      return { message: 'Deck is legal.' };
    }
    default: null;   
    
  }
};

const buildQuery = (data) => {

};

module.exports = { checkRules, buildQuery };
