const db = require('./db');
const app = require('./app');
const jwt = require('./jwt');


const config = {
  ...db,
  ...app,
  ...jwt,
};

module.exports = config;
