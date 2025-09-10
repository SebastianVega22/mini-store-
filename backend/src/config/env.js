require('dotenv').config();
module.exports = {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/mini_store',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173'
};
