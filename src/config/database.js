module.exports = {
    development: {
      username: 'postgres',
      password: 'postgres',
      database: 'financial',
      host: '127.0.0.1',
      dialect: 'postgres',
      logging: false, // Set to true if you want to see the SQL queries being executed
    },
    test: {
      username: 'your_username',
      password: 'your_password',
      database: 'your_test_database_name',
      host: '127.0.0.1',
      dialect: 'postgres',
      logging: false,
    },
    production: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
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