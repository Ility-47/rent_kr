const { Pool } = require('pg');

//const pool = new Pool({
//  user: 'postgres',
//  host: 'localhost',
//  database: 'rent',
//  password: '12345',
//  port: 5432,
//});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // берётся из переменных окружения
  ssl: { rejectUnauthorized: false } // важно для Vercel PostgreSQL!
});

// Простая обёртка над pool.query
const query = (text, params) => pool.query(text, params);

// Проверка подключения
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Ошибка подключения к БД:', err.stack);
  } else {
    console.log('Подключение к БД успешно');
  }
});

// Экспортируем всё вместе
module.exports = {
  pool,
  query
};
