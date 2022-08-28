const User = require('../models/users');
const bcrypt = require('bcrypt');

module.exports = class UserService {
  
  static async create({ username, email, password }) {
    let user = User.getByEmail(email);
    if (user)
      throw new Error('User already exists');
    
    const passwordhash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS),
    );

    user = await User.insert({
      username,
      email,
      passwordhash,
    });

    const token = await User.signIn(user);
    return [user, token];
  }
};
