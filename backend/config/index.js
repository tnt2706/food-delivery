import db from './db.js';
import app from './app.js';
import jwt from './jwt.js'; 
import mail from './email.js'


const config = {
  ...db,
  ...app,
  ...jwt,
  ...mail,
};

export default config;
