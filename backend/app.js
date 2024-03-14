const express = require('express');
const { PORT, DATABASE_URL } = require('./utils/config');
const { mongoose } = require('mongoose');
const { loginValidator, registerValidator } = require('./utils/validator/userValidator');
const { login, createUser, logout } = require('./controllers/user');

const app = express();

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(e => {
    console.error('MongoDB connection error', e);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', loginValidator, login);
app.post('/signup', registerValidator, createUser);

app.post('/logout', logout);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
