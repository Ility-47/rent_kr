const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
};