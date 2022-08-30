const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const User = require('../models/users');
const UserService = require('../services/UserService');

const ONE_DAY_IN_MS = 1000 * 24 * 24 * 60;

module.exports = Router()
  .post('/sessions', async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.getByEmail(email);
      if (!user)
        throw new Error('invalid credentials');
      
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
  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      })
      .status(204)
      .send();
  })
  .get('/me', authenticate, (req, res) => {
    res.json(req.user);
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

