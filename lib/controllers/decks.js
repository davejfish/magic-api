const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const DeckService = require('../services/DeckService');

module.exports = Router()
  .post('/create', authenticate, async (req, res, next) => {
    try {
      const response = await DeckService.create(req.body, req.user.id);
      res.json(response);
    } catch (e) {
      next(e);
    }
  });
