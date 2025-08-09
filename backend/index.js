// ====================== НАСТРОЙКИ ДЛЯ ДЕПЛОЯ ======================
require('dotenv').config(); // Загрузка переменных окружения (для локальной разработки)
const path = require('path'); // Для работы с путями к файлам

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const rentRoutes = require('./routes/rentRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ========== КОНФИГУРАЦИЯ ДЛЯ PRODUCTION (RENDER) ==========
// 1. Обслуживание статических файлов фронтенда (если Fullstack)
app.use(express.static(path.join(__dirname, '../frontend/dist'))); // Укажите правильный путь к сборке

// 2. Настройка CORS для production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app.onrender.com'] // Замените на ваш URL
    : '*', // Для разработки разрешаем все домены
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 3. Middleware для парсинга JSON
app.use(express.json({ limit: '10mb' })); // Лимит для загрузки файлов

// ====================== МАРШРУТЫ ======================
app.use('/api/auth', authRoutes);
app.use('/api', rentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// ========== ОБЯЗАТЕЛЬНЫЕ РОУТЫ ДЛЯ ДЕПЛОЯ ==========
// 1. Проверка работоспособности сервера
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    db: process.env.DATABASE_URL ? 'Connected' : 'Not configured',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 2. Fallback для фронтенда (если SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// ====================== ОБРАБОТКА ОШИБОК ======================
app.use(errorHandler);

// ====================== ЗАПУСК СЕРВЕРА ======================
const PORT = process.env.PORT || 3001; // Render автоматически назначает порт

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Listening on port ${PORT}`);
  console.log(`Database: ${process.env.DATABASE_URL ? 'Configured' : 'Not found'}`);
});

// ====================== ДОПОЛНИТЕЛЬНЫЕ НАСТРОЙКИ ======================
// Очистка пулов соединений (ваш существующий код)
setInterval(() => {
  if (global.adminPools) {
    const now = Date.now();
    Object.entries(global.adminPools).forEach(([token, pool]) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.exp * 1000 < now) {
          pool.end();
          delete global.adminPools[token];
        }
      } catch {
        pool.end();
        delete global.adminPools[token];
      }
    });
  }
}, 3600000);