const Deck = require('../models/deck.js');

const checkRules = async ({ rule_set, id, legal }) => {
  const arr = [];
  let deckCards = 0;
  let sbCards = 0;
  switch(rule_set) {
    case 'standard': {
      const cards = await Deck.getCardCount(id);

      for (const card of cards) {
        const strings = card.type_line.split(' ');
        let boolean = null;
        for (const string of strings) {
          if (string === 'Basic') {
            boolean = true;
            break;
          } else {
            boolean = false;
          }
        }
  
        if(card.quantity > 4 && !boolean) {
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
        if (legal) 
          await Deck.updateByID(id, { legal: false });
        return arr;
      } 

      if (!legal) 
        await Deck.updateByID(id, { legal: true });

      return true;
    }
    default: null;   
  }
};

const buildQuery = (data) => {
  const totalItems = data.length;
  let valueString = '';
  const arr = [];
  let i = 0;
  
  data.map((card, j) => {
    const string = `(
    ${`$${i + 1}`}, 
    ${`$${i + 2}`}, 
    ${`$${i + 3}`}, 
    ${`$${i + 4}`}, 
    ${`$${i + 5}`}, 
    ${`$${i + 6}`}), `;
    
    valueString += string;
    
    if (j + 1 === totalItems)
      valueString = valueString.slice(0, -2);
    arr.push(card.uid, card.deck_id, card.sk_id, card.type_line, card.name, card.sideboard);
    i += 6;
  });
  return [valueString, arr];
};

module.exports = { checkRules, buildQuery };
