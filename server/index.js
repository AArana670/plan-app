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

/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};

app.use(cors())
app.use(express.json())

app.get('/projects', async (req, res) => {
  data = await turso.execute("SELECT * FROM projects");
  res.json({ projects: data.rows });
});

app.get('/users/:id/events', async (req, res) => {
  data = await turso.execute("SELECT * FROM events INNER JOIN event_tags INNER JOIN role_tags INNER JOIN participations WHERE user_id = ?", [req.params.id]);
  res.json({ events: data.rows });
})

//region auth
app.post('/api/login', async (req, res) => {
  
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ error: "Missing email or password" });
    return;
  }
  if (!req.body.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  data = await turso.execute("SELECT * FROM users WHERE username = ? AND password = ?", [req.body.email, req.body.password]);
  if (data.rows.length == 0)
    res.status(401).json({ error: "Invalid credentials" });
  else
    res.json({ user: data.rows[0] });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
