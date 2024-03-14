const { mongoose } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { UNAUTHORIZED } = require('../utils/constants');
const CastomError = require('../utils/errors/CastomError');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: value => validator.isEmail(value)
      }
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30
    }
  },
  { versionKey: false }
);

userSchema.statics.checkUser = async function (email, password) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    return Promise.reject(new CastomError('Неверная почта или пароль', UNAUTHORIZED));
  }
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return Promise.reject(new CastomError('Неверная почта или пароль', UNAUTHORIZED));
  }

  return user;
};

module.exports = mongoose.model('user', userSchema);
