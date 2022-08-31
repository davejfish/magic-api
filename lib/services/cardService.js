// make functions for callign api


async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

async function fetchCards(identifiers) {
  const cards = await postData('https://api.scryfall.com/cards/collection', {
    identifiers,
  });
  return cards;
}


module.exports = { fetchCards };

