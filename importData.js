const { Client } = require('pg');

const client = new Client({
  user: process.env.DB_USER,
  host: 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

async function main() {
  await client.connect();
  const res = await client.query('SELECT NOW()');
  await client.end();
  
  console.log(res)
  return 0;
}

main();