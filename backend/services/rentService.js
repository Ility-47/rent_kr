const { query } = require('../config/db');

module.exports = {
  getErrors: async () => {
    const result = await query('SELECT * FROM error');
    return result.rows;
  },

  getDamages: async () => {
    const result = await query('SELECT * FROM damage');
    return result.rows;
  },

  getAvailableAutos: async () => {
    const result = await query(`
      SELECT
        a.name,
        a.gov_num,
        t.price_min,
        t.price_hour,
        t.price_day
      FROM auto a 
      JOIN tarif t ON a.tarif_id = t.id
      WHERE a.available = true;
    `);
    return result.rows;
  }
};