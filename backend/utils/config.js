require('dotenv').config();

const { PORT, DATABASE_URL, JWT } = process.env;

module.exports = {
  PORT,
  DATABASE_URL,
  JWT
};
