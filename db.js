const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "endYm1on",
  host: "rds-db-platformwithjuno.c1ckm5v9rj7w.eu-west-1.rds.amazonaws.com",
  port: 5432,
  database: "dev_platformwithjuno"
});

module.exports = pool;