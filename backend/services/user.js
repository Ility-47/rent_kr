const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

//const UserService = {
  module.exports = {
  createUser: async ({ username, email, password, age, pasport, v_u }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(bcrypt.hash('123456', 10))
    return query(
      `INSERT INTO client_auth (fio, email, password) VALUES ($1, $2, $3) RETURNING id, fio, email;
       INSERT INTO client (fio, age, pasport, v_u, rent_count, error_count) VALUES ($1, $4, $5, $6, %7) RETURNING id, fio, age`,
      [username, email, hashedPassword, age, pasport, v_u, 0, 0]
    );
 
  },
  findByEmail: async (email) => {
    return query('SELECT * FROM client_auth WHERE email = $1', [email]);
  },
  findById: async (id) => {
    return query('SELECT * FROM client_auth WHERE id = $1', [id]);
  },

  validateUser: async (email, password) => {
    try {
      const userResult = await query('SELECT * FROM client_auth WHERE email = $1', [email]);
      const user = userResult.rows[0];
      
      if (!user) {
        return { isValid: false, error: 'Пользователь не найден' };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { isValid: false, error: 'Неверный пароль' };
      }

      // Не возвращаем пароль в результате
      const { password: _, ...userWithoutPassword } = user;
      return { isValid: true, user: userWithoutPassword };

    } catch (error) {
      throw error;
    }
  }
  
  // Другие методы работы с пользователем...

};

//module.exports = UserService;