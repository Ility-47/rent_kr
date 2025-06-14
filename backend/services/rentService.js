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
        a.id,
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
  },
  // BookedAuto: async ({id_client}) => {
  //   const result = await query(`
  //     SELECT a.*
  //     FROM auto a
  //     JOIN akt k ON a.id = k.id_auto
  //     WHERE k.id_client = $1
  //       AND CURRENT_TIMESTAMP BETWEEN k.start_rent AND k.finish_rent;
  //   `,[id_client]);
  //   return result.rows;
  // },

  // getBookedAuto: async ({id_client}) => {
  //   const result = await query(`
  //     SELECT a.*
  //     FROM auto a
  //     JOIN akt k ON a.id = k.id_auto
  //     WHERE k.id_client = $1
  //       AND CURRENT_TIMESTAMP BETWEEN k.start_rent AND k.finish_rent;
  //   `,[id_client]);
  //   return result.rows;
  // }
  updateAutoAvailability: async (autoId, available) => {
    const result = await query(
      'UPDATE auto SET available = $1 WHERE id = $2 RETURNING *',
      [available, autoId]
    );
    return result.rows[0];
  },

  createRentRecord: async ({ id_auto, clientName, start_rent, finish_rent, mileage, tarif_id }) => {
    // 1. Получаем id клиента по ФИО из таблицы client
    const clientResult = await query(
      'SELECT id FROM client WHERE fio = $1',
      [clientName]
    );

    if (clientResult.rows.length === 0) {
      throw new Error('Клиент не найден');
    }

    const id_client = clientResult.rows[0].id;

    // 2. Преобразуем даты в формат PostgreSQL
    const pgStartDate = start_rent.replace('T', ' ');
    const pgFinishDate = finish_rent.replace('T', ' ');

    // 3. Вставляем запись об аренде
    const result = await query(
      `INSERT INTO akt (id_auto, id_client, start_rent, finish_rent, mileage, tarif_id) 
         VALUES ($1, $2, $3::timestamp, $4::timestamp, $5, $6) 
         RETURNING *`,
      [id_auto, id_client, pgStartDate, pgFinishDate, mileage, tarif_id]
    );

    return result.rows[0];
  },

  getBookedAuto: async (id_client) => {
    const result = await query(`
        SELECT 
            a.id,
            a.name,
            a.gov_num,
            t.price_min,
            t.price_hour,
            t.price_day
        FROM auto a
        JOIN akt k ON a.id = k.id_auto
        JOIN tarif t ON a.tarif_id = t.id
        WHERE k.id_client = $1
            AND CURRENT_TIMESTAMP BETWEEN k.start_rent AND k.finish_rent
        LIMIT 1;
    `, [id_client]);
    return result.rows;
  },
  getFinishedRentsByUserId: async (userId) => {
    const result = await query(`
      SELECT 
        a.start_rent AS start,
        a.finish_rent AS finish,
        c.name,
        c.gov_num,
        c.tarif_id AS car_tarif_id,
        a.tarif_id AS rent_tarif_id,
        t.price_min,
        t.price_hour,
        t.price_day
      FROM akt a
      JOIN auto c ON a.id_auto = c.id
      JOIN tarif t ON c.tarif_id = t.id
      WHERE a.id_client = $1 AND a.finish_rent IS NOT NULL
      ORDER BY a.start_rent DESC
    `, [userId]);
    //const result = await pool.query(queryText, [userId]);
    return result.rows;
  },

};