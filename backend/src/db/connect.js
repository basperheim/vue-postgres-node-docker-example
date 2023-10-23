const { POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_PORT } = process.env;
const PostgresDriver = require("../db/postgres.driver");

const config = {
  user: POSTGRES_USER,
  host: "app_db",
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: POSTGRES_PORT || 5432,

  opts: {
    // Don't use in production
    debug: true,
  },
};

const connection = new PostgresDriver(config);
module.exports = connection;
