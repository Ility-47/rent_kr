const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const rentRoutes = require('./routes/rentRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Для аутентификации
app.use('/api', rentRoutes);     // Для аренды
app.use('/api/users', userRoutes);     // Для аренды
app.use('/api/admin', adminRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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