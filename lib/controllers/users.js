const { Router } = require('express');
const User = require('../models/users');
const UserService = require('../services/UserService');

const ONE_DAY_IN_MS = 1000 * 24 * 24 * 60;

module.exports = Router()
  .post('/sessions', async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.getByEmail(email);
      UserService.checkPassword(req.body.password, user);
      const token = User.signIn(user);
      res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({
          message: 'Successfully signed in',
        });
    } catch (e) {
      next(e);
    }
  })
  .post('/', async (req, res, next) => {
    try {
      const [user, token] = await UserService.create(req.body);
      res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json(user);
    } catch (e) {
      next(e);
    }
  });

