const jwt = require('jsonwebtoken');
const UserService = require('../services/user');
const { validationResult } = require('express-validator');
const config = require('../config');
const { pool } = require('../config/db'); // Для транзакции

const AuthController = {
  register: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, age, pasport, v_u } = req.body;

    let client;
    try {
      await pool.connect();

      // Проверка существования пользователя
      // const existingUser = await UserService.findByEmail(email);
      // if (existingUser.rows.length > 0) {
      //   return res.status(400).json({ error: 'Email already exists' });
      // }

      // Начинаем транзакцию
      await pool.query('BEGIN');

      // Создание клиента
      const newUser = await UserService.createUser({ username, age, pasport, v_u });

      // Создание учётной записи
      await UserService.createUserAuth({ username, email, password });

      // Генерация JWT
      const token = jwt.sign(
        { userId: newUser.id },
        config.JWT_SECRET,
        { expiresIn: '1h' }
      );

      await pool.query('COMMIT');

      res.status(201).json({
        user: newUser,
        token
      });
    } catch (error) {
      await pool.query('ROLLBACK');
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const { isValid, user, error } = await UserService.validateUser(email, password);
      if (!isValid) {
        return res.status(401).json({ error });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.JWT_SECRET,
        { expiresIn: '24h' }
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