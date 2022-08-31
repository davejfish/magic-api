const { fetchCards } = require('../lib/services/cardService');

const testCollection = fetchCards({
  identifiers: [
    {
      name: 'Ascendant Packleader'
    },
    {
      name: 'Ascendant Packleader'
    },
    {
      name: 'Ascendant Packleader'
    },
    {
      name: 'Ascendant Packleader'
    },
    {
      name: 'Sculptor of Winter'
    },
    {
      name: 'Sculptor of Winter'
    },
    {
      name: 'Sculptor of Winter'
    },
    {
      name: 'Sculptor of Winter'
    },
    {
      name: 'Werewolf Pack Leader'
    },
    {
      name: 'Werewolf Pack Leader'
    },
    {
      name: 'Werewolf Pack Leader'
    },
    {
      name: 'Werewolf Pack Leader'
    },
    {
      name: 'Jewel Thief'
    },
  ]
});

module.exports = { testCollection };
