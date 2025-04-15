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

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type']
};

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

//region Projects
app.get('/api/projects', async (req, res) => {
  try{
    data = await turso.execute("SELECT * FROM projects INNER JOIN participations ON participations.project_id = projects.id WHERE user_id = ?", [req.headers["user-id"]]);
    res.json({ projects: data.rows });
    return;
  }catch (e) {
    res.status(500);
  }
});

app.post('/api/projects', async (req, res) => {
  data = await turso.execute("INSERT INTO projects (name, archived, description) VALUES (?, ?, ?)", [req.body.name, req.body.archived, req.body.description]);
  role = await turso.execute("INSERT INTO roles (name, project_id) VALUES ('admin', ?)", [data.lastInsertRowid]);
  //TODO: Create default attributes
  //TODO: Give edit access to every attribute
  await turso.execute("INSERT INTO participations (user_id, project_id, role_id) VALUES (?, ?, ?)", [req.headers["user-id"], data.lastInsertRowid, role.lastInsertRowid]);
  res.json({ project: data.rows[0] });
});

app.put('/api/projects/:id', async (req, res) => {
  let newValue;
  try{
    if (req.body.name){
      newValue = req.body.name
      await turso.execute("UPDATE projects SET name = ? WHERE id = ?", [req.body.name, req.params.id]);
    }
    if (req.body.archived){
      newValue = req.body.archived
      await turso.execute("UPDATE projects SET archived = ? WHERE id = ?", [req.body.archived, req.params.id]);
    }
  }catch (e) {
    res.status(500);
    return;
  }
  res.status(200).json({ project: {id: req.params.id, newValue: newValue} });
})

app.delete('/api/projects/:id', async (req, res) => {
  try{
    await turso.execute("DELETE FROM projects WHERE id = ?", [req.params.id]);
  }catch (e) {
    console.log(e);
    res.status(500);
    return;
  }
  res.status(200).json({ project: {id: req.params.id} });
})

//region Events
app.get('/api/users/:id/events', async (req, res) => {
  data = await turso.execute("SELECT * FROM events\
      INNER JOIN event_tags on event_tags.event_id = events.id\
      INNER JOIN role_tags on role_tags.tag_id = event_tags.tag_id\
      INNER JOIN participations on participations.role_id = role_tags.role_id WHERE user_id = ?", [req.params.id]);
  res.json({ events: data.rows });
})

app.get('/api/projects/:id/events', async (req, res) => {
  if (!req.headers["user-id"]){
    res.status(401).json({ error: "Missing userId" });
    return;
  }
  data = await turso.execute("SELECT * FROM events\
      INNER JOIN event_tags on event_tags.event_id = events.id\
      INNER JOIN role_tags on role_tags.tag_id = event_tags.tag_id\
      INNER JOIN participations on role_tags.role_id = participations.role_id\
      WHERE project_id = ? and user_id = ?", [req.params.id, req.headers["user-id"]]);
  res.json({ events: data.rows });
})

//region Roles
app.get('/api/projects/:id/roles', async (req, res) => {
  data = await turso.execute("SELECT * FROM roles WHERE project_id = ?", [req.params.id]);
  res.json({ roles: data.rows });
})

app.post('/api/projects/:id/roles', async (req, res) => {
  role = await turso.execute("INSERT INTO roles (name, project_id) VALUES (?, ?)", [req.body.name, req.params.id]);
  attributes = await turso.execute("SELECT * FROM attributes WHERE project_id = ?", [req.params.id]);
  for (let i = 0; i < attributes.rows.length; i++) {
    turso.execute("INSERT INTO role_attributes (role_id, attribute_id, level) VALUES (?, ?, 0)", [role.lastInsertRowid, attributes.rows[i].id]);
  }

  res.json({ role: role.rows[0] });
})

app.get('/api/projects/:pid/roles/:rid', async (req, res) => {
  data = await turso.execute("SELECT * FROM role_attributes \
    INNER JOIN attributes ON attributes.id = role_attributes.attribute_id \
    WHERE project_id = ? AND role_id = ?", [req.params.pid, req.params.rid]);
  res.json({ permissions: data.rows });
})

app.put('/api/projects/:pid/roles/:rid', async (req, res) => {
  queries = []
  for (let attrId in req.body.permissions){
    queries.push(turso.execute("UPDATE role_attributes SET level = ? WHERE role_id = ? AND attribute_id = ?", [req.body.permissions[attrId], req.params.rid, attrId]));
  }
  Promise.all(queries).then((results) => {
    res.json({ role: {id: req.params.rid} });
  })
})

app.get('/api/projects/:id/users/', async (req, res) => {
  data = await turso.execute("SELECT * FROM users\
      INNER JOIN participations on participations.user_id = users.id\
      INNER JOIN roles on roles.id = participations.role_id\
      WHERE participations.project_id = ?", [req.params.id]);
  res.json({ users: data.rows });
})

//region User Accounts
app.post('/api/login', async (req, res) => {
  
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ error: "Missing email or password" });
    return;
  }
  if (!req.body.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  data = await turso.execute("SELECT * FROM users WHERE email = ? AND password = ?", [req.body.email, req.body.password]);
  if (data.rows.length == 0)
    res.status(401).json({ error: "Invalid credentials" });
  else
    res.json({ user: data.rows[0] });
})

app.post('/api/register', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ error: "Missing email or password" });
    return;
  }
  if (!req.body.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  data = await turso.execute("SELECT * FROM users WHERE email = ?", [req.body.email]);
  if (data.rows.length > 0) {
    res.status(409).json({ error: "Email already in use" });
    return;
  }

  newUser = await turso.execute("INSERT INTO users (email, password) VALUES (?, ?)", [req.body.email, req.body.password]);
  res.json({ userId: newUser.lastInsertRowid.toString() });
});

app.put('/api/users/:id', async (req, res) => {

  if (req.body.email && !req.body.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  if (req.body.password)
    await turso.execute("UPDATE users SET password = ? WHERE id = ?", [req.body.password, req.params.id]);
  if (req.body.email)
    await turso.execute("UPDATE users SET email = ? WHERE id = ?", [req.body.email, req.params.id]);
  res.status(200)
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
