const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const rentRoutes = require('./routes/rentRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Для аутентификации
app.use('/api', rentRoutes);     // Для аренды
app.use('/api/users', userRoutes);     // Для аренды
// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});