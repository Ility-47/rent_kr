// const { pool } = require('../config/db'); // Предполагаем, что db.js экспортирует pool
// const bcrypt = require('bcryptjs');

// module.exports = {
//   async createUser({ username, age, pasport, v_u }) {
//     const clientQuery = `
//       INSERT INTO client (fio, age, pasport, v_u, rent_count, error_count)
//       VALUES ($1, $2, $3, $4, $5, $6)
//       RETURNING id, fio, age
//     `;
//     const values = [username, age, pasport, v_u, 0, 0];

//     const result = await pool.query(clientQuery, values);
//     return result.rows[0];
//   },

//   async createUserAuth({ username, email, password }) {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const authQuery = `
//       INSERT INTO client_auth (fio, email, password)
//       VALUES ($1, $2, $3)
//       RETURNING id, fio, email
//     `;
//     const values = [username, email, hashedPassword];

//     const result = await pool.query(authQuery, values);
//     return result.rows[0];
//   },

//   findByEmail: async (email) => {
//     const result = await pool.query('SELECT * FROM client_auth WHERE email = $1', [email]);

//     // Если пользователь найден — вернуть его, иначе null
//     return result.rows.length > 0 ? result.rows[0] : null;
//   },

//   validateUser: async (email, password) => {
//     try {
//       const result = await pool.query('SELECT * FROM client_auth WHERE email = $1', [email]);
//       const user = result.rows[0];

//       if (!user) {
//         return { isValid: false, error: 'Пользователь не найден' };
//       }

//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return { isValid: false, error: 'Неверный пароль' };
//       }

//       const { password: _, ...userWithoutPassword } = user;
//       return { isValid: true, user: userWithoutPassword };
//     } catch (error) {
//       throw error;
//     }
//   },
// };

const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

module.exports = {
  async getUserById(userId) {
    const result = await pool.query(`
      SELECT c.id, c.fio, c.age, c.pasport, c.v_u, c.rent_count, c.error_count,
             ca.email, ca.phone, ca.payment_method
      FROM client c
      LEFT JOIN client_auth ca ON c.id = ca.id
      WHERE c.id = $1
    `, [userId]);
    return result.rows[0];
  },

  async updatePhone(userId, phone) {
    await pool.query(
      'UPDATE client_auth SET phone = $1 WHERE id = $2',
      [phone, userId]
    );
    return this.getUserById(userId);
  },

  async updateEmail(userId, email) {
    await pool.query(
      'UPDATE client_auth SET email = $1 WHERE id = $2',
      [email, userId]
    );
    return this.getUserById(userId);
  },

  async updatePaymentMethod(userId, paymentMethod) {
    await pool.query(
      'UPDATE client_auth SET payment_method = $1 WHERE id = $2',
      [paymentMethod, userId]
    );
    return this.getUserById(userId);
  },

  async deleteAccount(userId) {
    await pool.query('DELETE FROM client WHERE id = $1', [userId]);
    await pool.query('DELETE FROM client_auth WHERE id = $1', [userId]);
    return { success: true };
  },

  // Ваши существующие методы
  async createUser({ username, age, pasport, v_u }) {
    const clientQuery = `
      INSERT INTO client (fio, age, pasport, v_u, rent_count, error_count)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, fio, age
    `;
    const values = [username, age, pasport, v_u, 0, 0];
    const result = await pool.query(clientQuery, values);
    return result.rows[0];
  },

  async createUserAuth({ username, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const authQuery = `
      INSERT INTO client_auth (fio, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, fio, email
    `;
    const values = [username, email, hashedPassword];
    const result = await pool.query(authQuery, values);
    return result.rows[0];
  },

  findByEmail: async (email) => {
    const result = await pool.query('SELECT * FROM client_auth WHERE email = $1', [email]);
    return result.rows.length > 0 ? result.rows[0] : null;
  },

  validateUser: async (email, password) => {
    try {
      const result = await pool.query('SELECT * FROM client_auth WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user) {
        return { isValid: false, error: 'Пользователь не найден' };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { isValid: false, error: 'Неверный пароль' };
      }

      const { password: _, ...userWithoutPassword } = user;
      return { isValid: true, user: userWithoutPassword };
    } catch (error) {
      throw error;
    }
  },
};