//  config.js
//
//  Simple application configuration. Extend as needed.
module.exports = {
	port: process.env.PORT || 8123,
  db: {
    host: process.env.DATABASE_HOST || 'db',
    database: 'users',
    user: 'users_service',
    password: '123',
    port: 3306
  }
};
