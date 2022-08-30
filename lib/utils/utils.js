const checkRules = (rules, cards) => {
  const arr = [];
  switch(rules) {
    case 'standard':
      for (const card of cards) {
        console.log('------------in loop');
        const found = arr.find(card => card.sk_id === arr.sk_id);
        console.log('---------------;;;;;;', found);
      }
      break;
    default: null;    
  }
};

module.exports = checkRules;

