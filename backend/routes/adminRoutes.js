const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Авторизация
router.post('/login', adminController.login);
router.post('/logout', adminController.logout);

// Проверка авторизации для всех последующих роутов
router.use(adminController.checkAuth);

// CRUD для всех таблиц
const tables = ['auto', 'client', 'client_auth', 'damage', 'error'];

tables.forEach(table => {
    router.get(`/${table}`, adminController.getAll(table));
    router.post(`/${table}`, adminController.create(table));
    router.put(`/${table}/:id`, adminController.update(table));
    router.delete(`/${table}/:id`, adminController.delete(table));
});

module.exports = router;