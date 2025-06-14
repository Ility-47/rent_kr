const rentService = require('../services/rentService');
const { query } = require('../config/db');

module.exports = {
  getErrors: async (req, res, next) => {
    try {
      const errors = await rentService.getErrors();
      res.json(errors);
    } catch (error) {
      next(error);
    }
  },

  getDamages: async (req, res, next) => {
    try {
      const damages = await rentService.getDamages();
      res.json(damages);
    } catch (error) {
      next(error);
    }
  },

  getAvailableAutos: async (req, res, next) => {
    try {
      const autos = await rentService.getAvailableAutos();
      res.json(autos);
    } catch (error) {
      next(error);
    }
  },
  createRent: async (req, res, next) => {
    try {
      const { carId, startDate, endDate, clientName, mileage, tarif_id } = req.body;
      console.log(tarif_id)
      // 1. Начинаем транзакцию
      await query('BEGIN');

      // 2. Получаем id клиента
      const clientResult = await query(
        'SELECT id FROM client WHERE fio = $1',
        [clientName]
      );

      if (clientResult.rows.length === 0) {
        throw new Error('Клиент не найден');
      }

      const id_client = clientResult.rows[0].id;

      // 3. Преобразуем даты
      const pgStartDate = startDate.replace('T', ' ');
      const pgFinishDate = endDate.replace('T', ' ');

      // 4. Создаем запись об аренде
      const rentResult = await query(
        `INSERT INTO akt (id_auto, id_client, start_rent, finish_rent, mileage, tarif_id) 
                 VALUES ($1, $2, $3::timestamp, $4::timestamp, $5, $6) 
                 RETURNING *`,
        [carId, id_client, pgStartDate, pgFinishDate, mileage, tarif_id]
      );

      // 5. Обновляем доступность авто
      await query(
        'UPDATE auto SET available = false WHERE id = $1',
        [carId]
      );

      // 6. Подтверждаем транзакцию
      await query('COMMIT');

      res.json(rentResult.rows[0]);

    } catch (error) {
      // Откатываем транзакцию при ошибке
      await query('ROLLBACK');
      console.error('Error in createRent:', error);
      next(error);
    }
  },

  getBookedAuto: async (req, res, next) => {
    try {
      const { id_client } = req.params;
      const auto = await rentService.getBookedAuto(id_client);
      res.json(auto);
    } catch (error) {
      next(error);
    }
  },
  finishRent: async (req, res, next) => {
    const { carId, clientId } = req.body;

    try {
      // Начинаем транзакцию
      await query('BEGIN');
      // 1. Находим активную запись аренды
      const aktResult = await query(
        'SELECT * FROM akt WHERE id_auto = $1 AND id_client = $2 AND finish_rent >= CURRENT_TIMESTAMP',
        [carId, clientId]
      );

      if (aktResult.rows.length === 0) {
        throw new Error('Активная аренда не найдена');
      }

      const aktId = aktResult.rows[0].id;

      // 2. Обновляем статус авто
      await query(
        'UPDATE auto SET available = TRUE WHERE id = $1',
        [carId]
      );

      // 3. Завершаем аренду — ставим текущее время
      const now = new Date();
      now.setMilliseconds(0);
      await query(
        'UPDATE akt SET finish_rent = $1 WHERE id = $2',
        [now, aktId]
      );

      // 4. Коммитим транзакцию
      await query('COMMIT');

      res.json({ message: 'Аренда успешно завершена' });

    } catch (error) {
      await query('ROLLBACK');
      console.error('Ошибка при завершении аренды:', error);
      next(error);
    }
  },
  getFinishedRents: async (req, res, next) => {
    try {
    const { userId } = req.params;
      const rents = await rentService.getFinishedRentsByUserId(userId);

      // Добавляем рассчитанную стоимость
      const enrichedRents = rents.map(rent => {
        const durationMinutes = (new Date(rent.finish) - new Date(rent.start)) / 60000;

        let pricePerUnit = rent.price_min;
        if (rent.rent_tarif_id === 2) {
          pricePerUnit = rent.price_hour;
        } else if (rent.rent_tarif_id === 3) {
          pricePerUnit = rent.price_day;
        }

        const cost = parseFloat((durationMinutes * pricePerUnit).toFixed(2));

        return {
          ...rent,
          cost,
          durationMinutes
        };
      });

      res.json(enrichedRents);
    } catch (error) {
      console.error('Ошибка при получении истории аренд:', error);
      res.status(500).json({ error: 'Не удалось загрузить историю аренд' });
    }
  }

};