const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
  createUser: async args => {
    try {
      const user = await User.findOne({ email: args.userInput.email });
      if (user) {
        throw new Error('User already exists.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword
      });
      const userSaveResult = await newUser.save();
      const { password, ...rest } = userSaveResult._doc;
      return { ...rest, password: null };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User doesn\'t exist!');
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!')
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_PASSWORD,
      { expiresIn: '1h' }
    );

    return {
      userId: user.id,
      token,
      tokenExpiration: 1
    };
  }
};
