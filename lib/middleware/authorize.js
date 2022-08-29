const Deck = require('../models/deck');

module.exports = async (req, res, next) => {
  try {
    const data = await Deck.getByID(req.params.id);
    if (req.user.id !== data.uid)
      throw new Error('You are not authorized to complete this action');
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
