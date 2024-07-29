require('dotenv').config()

const {
  DATABASE_HOST,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_DIALECT,
  DATABASE_DATABASE,
} = process.env
module.exports = {
    development: {
      username: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      database: DATABASE_DATABASE,
      host: 'localhost',
      port: 5432,
      dialect: DATABASE_DIALECT,
    },
    test: {
      username: 'postgres',
      password: 'postgres',
      database: 'financial',
      host: DATABASE_HOST,
      port: 5432,
      dialect: 'postgres',
      logging: false,
    },
    production: {
      username: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      database: DATABASE_DATABASE,
      host: DATABASE_HOST,
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Use this option if you encounter SSL certificate issues
        },
      },
    },
  };