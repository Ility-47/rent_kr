const UserService = require('../services/user');

module.exports = {
  getCurrentUser: async (req, res) => {
    try {
      // req.user содержит данные из JWT токена (после authMiddleware)
      const user = await UserService.findById(req.user.userId);
      
      // Не возвращаем пароль
      const { password, ...safeUser } = user;
      res.json(safeUser);
      
    } catch (error) {
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
};