// import service model
// const Deck = require("../models/deck");

// get the deck or sideboard

// if the req.user.id !== response.uid throw error
// set the caught error to status 403

module.exports = async (req, res, next) => {
  try {
    // still building
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
