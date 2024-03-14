const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const { OK, NOT_FOUND, BAD_REQUEST, CREATED, CONFLICT } = require('../utils/constants');
const CastomError = require('../utils/errors/CastomError');
const { JWT } = require('../utils/config');

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      email,
      password: hash,
      name
    });

    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    return res.status(CREATED).send(userWithoutPassword);
  } catch (e) {
    console.log(e);
    if (e.code === 11000) {
      next(new CastomError('Пользователь с таким email уже существует.', CONFLICT));
    } else if (e instanceof mongoose.Error.ValidationError) {
      next(new CastomError('При регистрации пользователя произошла ошибка', BAD_REQUEST));
    } else {
      next(e);
    }
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.checkUser(email, password);
    const token = jwt.sign({ _id: user._id }, JWT, {
      expiresIn: '7d'
    });

    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;
    res
      .cookie('token', token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7
      })
      .status(OK)
      .send(userWithoutPassword);
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.status(OK).send({ message: 'Вы успешно вышли из системы' });
  } catch (e) {
    next(e);
  }
};

const getUser = async (req, res, next, query) => {
  try {
    const user = await userModel.findOne(query).orFail();
    res.status(OK).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      next(new CastomError(e.message, BAD_REQUEST));
    } else if (e instanceof mongoose.Error.DocumentNotFoundError) {
      next(new CastomError('User is not found', NOT_FOUND));
    } else {
      next(e);
    }
  }
};

const getUserById = (req, res, next) => {
  const { id } = req.params;
  const query = { _id: id };
  getUser(req, res, next, query);
};

const getMe = (req, res, next) => {
  const query = { _id: req.user._id };
  getUser(req, res, next, query);
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.user._id,
        { name, email },
        {
          new: true,
          runValidators: true
        }
      )
      .orFail();

    res.status(OK).send(updatedUser);
  } catch (e) {
    if (e instanceof mongoose.Error.DocumentNotFoundError) {
      return next(new CastomError('Пользователь не найден', NOT_FOUND));
    }
    if (e instanceof mongoose.Error.ValidationError) {
      return next(new CastomError(e.message, BAD_REQUEST));
    }
    next(e);
  }
};

module.exports = {
  getMe,
  getUserById,
  updateUser,
  createUser,
  login,
  logout
};
