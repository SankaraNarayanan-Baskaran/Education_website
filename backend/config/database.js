const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "sank",
  host: "localhost",
  port: 5432,
  database:"Edu_DB",
});

module.exports = pool;