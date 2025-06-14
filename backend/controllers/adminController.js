const { Pool } = require('pg');
const config = require('../config');

let adminPool = null;

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Закрываем предыдущее подключение, если есть
        if (adminPool) await adminPool.end();
        // Создаем новое подключение
        adminPool = new Pool({
            user: String(username),
            host: 'localhost',
            database: 'rent',
            password: String(password),
            port: 5432,
        });

        // Проверяем подключение и права
        const client = await adminPool.connect();
        try {
            await client.query('BEGIN');
            await client.query('SELECT * FROM pg_roles WHERE rolname = current_user');
            await client.query('COMMIT');
            res.json({ success: true });
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Admin login error:', error);
        if (adminPool) {
            await adminPool.end();
            adminPool = null;
        }
        res.status(401).json({ 
            success: false,
            message: 'Неверные учетные данные PostgreSQL'
        });
    }
};

exports.checkAuth = async (req, res, next) => {
    if (!adminPool) {
        return res.status(401).json({ message: 'Требуется авторизация' });
    }

    try {
        const client = await adminPool.connect();
        client.release();
        next();
    } catch (error) {
        res.status(401).json({ message: 'Сессия устарела, войдите снова' });
    }
};

exports.logout = async (req, res) => {
    try {
        if (adminPool) {
            await adminPool.end();
            adminPool = null;
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Ошибка при выходе' });
    }
};

// CRUD операции
const handleDBOperation = async (req, res, operation) => {
    if (!adminPool) {
        return res.status(401).json({ message: 'Нет активного подключения' });
    }

    let client;
    try {
        client = await adminPool.connect();
        const result = await operation(client);
        res.json(result);
    } catch (error) {
        console.error('DB operation error:', error);
        res.status(500).json({ message: 'Ошибка базы данных' });
    } finally {
        if (client) client.release();
    }
};

exports.getAll = (table) => (req, res) => {
    handleDBOperation(req, res, async (client) => {
        const { rows } = await client.query(`SELECT * FROM ${table}`);
        return rows;
    });
};

exports.create = (table) => (req, res) => {
    handleDBOperation(req, res, async (client) => {
        // Удаляем поле id, если оно есть (для автоинкремента)
        const { id, ...data } = req.body;
        const fields = Object.keys(data);
        const values = Object.values(data);
        
        const query = `
            INSERT INTO ${table} (${fields.join(', ')})
            VALUES (${fields.map((_, i) => `$${i + 1}`).join(', ')})
            RETURNING *
        `;
        console.log(query)
        const { rows } = await client.query(query, values);
        return rows[0];
    });
};

exports.update = (table) => (req, res) => {
    handleDBOperation(req, res, async (client) => {
        const { id } = req.params;
        const { id: _, ...data } = req.body; // Исключаем id из обновления
        const fields = Object.keys(data);
        const values = Object.values(data);
        
        const query = `
            UPDATE ${table}
            SET ${fields.map((f, i) => `${f} = $${i + 1}`).join(', ')}
            WHERE id = $${fields.length + 1}
            RETURNING *
        `;
        
        const { rows } = await client.query(query, [...values, id]);
        return rows[0] || { message: 'Запись не найдена' };
    });
};

exports.delete = (table) => (req, res) => {
    handleDBOperation(req, res, async (client) => {
        const { id } = req.params;
        const { rowCount } = await client.query(
            `DELETE FROM ${table} WHERE id = $1`,
            [id]
        );
        return { success: rowCount > 0 };
    });
};