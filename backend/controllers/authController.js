const jwt = require('jsonwebtoken');
const UserService = require('../services/user');
const { validationResult } = require('express-validator');
const config = require('../config');

const AuthController = {
  register: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password, age, pasport, v_u } = req.body;

      // Проверка существования пользователя
      const existingUser = await UserService.findByEmail(email);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Создание пользователя
      const newUser = await UserService.createUser({ username, email, password, age, pasport, v_u });

      // Генерация JWT
      const token = jwt.sign(
        { userId: newUser.rows[0].id },
        config.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(201).json({
        user: newUser.rows[0],
        token
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      // Валидация входных данных
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Проверка пользователя
      const { isValid, user, error } = await UserService.validateUser(email, password);
      if (!isValid) {
        return res.status(401).json({ error });
      }

      // Генерация JWT токена
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.JWT_SECRET,
        { expiresIn: '24h' } // Токен действителен 24 часа
      );

      res.json({
        message: 'Вход выполнен успешно',
        token,
        user
      });

    } catch (error) {
      next(error);
    }
  },
};

module.exports = AuthController;