const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');
const createClient = require('@libsql/client').createClient

require('dotenv').config()

const turso = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN,
});

app.use(cors())

app.get('/', async (req, res) => {
  data = await turso.execute("SELECT * FROM projects");
  res.json({ projects: data.rows });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
