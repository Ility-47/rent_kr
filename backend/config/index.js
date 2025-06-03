module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || '1488',
    DB: {
      HOST: process.env.DB_HOST || 'localhost',
      USER: process.env.DB_USER || 'postgres',
      PASSWORD: process.env.DB_PASSWORD || '12345',
      NAME: process.env.DB_NAME || 'rent',
      PORT: process.env.DB_PORT || 5432,
    },
  };