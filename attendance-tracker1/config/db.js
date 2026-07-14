const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for Supabase / cloud Postgres
      },
    },
    logging: false,
  });
} else {
  const dialect = process.env.DB_DIALECT || 'mysql';
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: dialect,
    logging: false,
  });
}

// Test the database connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully...'))
  .catch(err => console.log('Database connection error: ' + err));

module.exports = sequelize;
