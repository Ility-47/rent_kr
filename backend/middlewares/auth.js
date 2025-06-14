const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Необходим токен авторизации' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded; // ← должен содержать, например, { userId, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Неверный или просроченный токен' });
  }
};