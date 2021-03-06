require('./environment');
module.exports = {
  client: 'postgresql',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  },
  pool: {
    min: Number(process.env.DATABASE_POOL_MIN) || 1,
    max: Number(process.env.DATABASE_POOL_MAX) || 5
  },
  migrations: {
    directory: 'db/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: 'db/seeds',
  }
};
