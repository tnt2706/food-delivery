import db from './db.js';
import app from './app.js';
import jwt from './jwt.js'; 


const config = {
  ...db,
  ...app,
  ...jwt,
};

export default config;
