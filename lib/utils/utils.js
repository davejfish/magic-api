const Deck = require('../models/deck.js');

const checkRules = async ({ rule_set, id }) => {
  const arr = [];
  let deckCards = 0;
  let sbCards = 0;
  switch(rule_set) {
    case 'standard': {
      console.log('+++++++++++++++++++++++++++++++');
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
      console.log('deck of cards =========', deckCards);
      console.log('sb of cards =========', sbCards);
      console.log('total of cards =========', totalCards);

      return { message: 'Deck is legal.' };
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
    ${`$${i + 5}`}), `;
    
    valueString += string;
    
    if (j + 1 === totalItems)
      valueString = valueString.slice(0, -2);
    arr.push(card.uid, card.deck_id, card.sk_id, card.image_uris, card.name);
    i += 5;
  });
  return [valueString, arr];
};

module.exports = { checkRules, buildQuery };
