const express = require('express')
const app = express()
const port = 8080
const cors = require('cors')
const createClient = require('@libsql/client').createClient
const serverless = require('serverless-http')

require('dotenv').config()

LEVEL_EDIT = 2
LEVEL_VIEW = 1
LEVEL_NONE = 0

DEFAULT_WORK_ATTRIBUTES = ['Nombre', 'Artista', 'Altura', 'Peso']
DEFAULT_BUDGET_ATTRIBUTES = ['Nombre', 'Precio', 'Cantidad', 'Total']
DEFAULT_OTHER_ATTRIBUTES = ['Nombre']

const turso = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN,
});

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
});

//region Permissions
async function hasPermission(user, project, attr, level) {
  const roles = await turso.execute("SELECT * FROM participations\
    INNER JOIN roles ON roles.id = participations.role_id\
    WHERE user_id = ? AND participations.project_id = ?", [user, project])
  
  const role = roles.rows[0]
  if (role.name=='admin') return true

  const permissions = await turso.execute("SELECT attribute_id, name, level FROM role_attributes\
    INNER JOIN attributes ON attributes.id = role_attributes.attribute_id\
    WHERE role_id = ?", [role.role_id])

  const permission = permissions.rows.find((permission) => (permission.name == attr || permission.attribute_id.toString() == attr))
  if (!permission) return false
  return permission.level >= level
}

async function isAdmin(user, project) {
  const roles = await turso.execute("SELECT * FROM participations\
    INNER JOIN roles ON roles.id = participations.role_id\
    WHERE user_id = ? AND participations.project_id = ?", [user, project])
  
  const role = roles.rows[0]
  return role.name=='admin'
}

//region Projects
app.get('/api/projects', async (req, res) => {
  try{
    data = await turso.execute("SELECT projects.*, roles.name AS role FROM projects\
      INNER JOIN participations ON participations.project_id = projects.id\
      INNER JOIN roles ON roles.id = participations.role_id\
      WHERE user_id = ?", [req.headers["user-id"]])
    res.json({ projects: data.rows })
    return
  }catch (e) {
    res.status(500)
  }
})

app.get('/api/projects/:id', async (req, res) => {
  try{
    data = await turso.execute("SELECT * FROM projects WHERE id = ?", [req.params.id])
    res.json({ project: data.rows[0] })
    return
  }catch (e) {
    res.status(500)
  }
})

app.post('/api/projects', async (req, res) => {
  const data = await turso.execute("INSERT INTO projects (name, archived, description) VALUES (?, ?, ?)", [req.body.name, req.body.archived, req.body.description])
  const role = await turso.execute("INSERT INTO roles (name, project_id) VALUES ('admin', ?)", [data.lastInsertRowid])
  turso.execute("INSERT INTO participations (user_id, project_id, role_id) VALUES (?, ?, ?)", [req.headers["user-id"], data.lastInsertRowid, role.lastInsertRowid])
  let attr
  for (let i in DEFAULT_WORK_ATTRIBUTES){
    turso.execute("INSERT INTO attributes (name, project_id, spreadsheet) VALUES (?, ?, 1)", [DEFAULT_WORK_ATTRIBUTES[i], data.lastInsertRowid])
    //turso.execute("INSERT INTO role_attributes (role_id, attribute_id, level) VALUES (?, ?, ?)", [role.lastInsertRowid, attr.lastInsertRowid, LEVEL_EDIT])
  }
  for (let i in DEFAULT_BUDGET_ATTRIBUTES){
    turso.execute("INSERT INTO attributes (name, project_id, spreadsheet) VALUES (?, ?, 2)", [DEFAULT_BUDGET_ATTRIBUTES[i], data.lastInsertRowid])
    //turso.execute("INSERT INTO role_attributes (role_id, attribute_id, level) VALUES (?, ?, ?)", [role.lastInsertRowid, attr.lastInsertRowid, LEVEL_EDIT])
  }
  for (let i in DEFAULT_OTHER_ATTRIBUTES){
    turso.execute("INSERT INTO attributes (name, project_id, spreadsheet) VALUES (?, ?, 3)", [DEFAULT_OTHER_ATTRIBUTES[i], data.lastInsertRowid])
    //turso.execute("INSERT INTO role_attributes (role_id, attribute_id, level) VALUES (?, ?, ?)", [role.lastInsertRowid, attr.lastInsertRowid, LEVEL_EDIT])
  }
  res.json({ project: data.lastInsertRowid.toString() })
})

app.put('/api/projects', async (req, res) => {
  try{
    const participations = await turso.execute('SELECT * FROM participations WHERE project_id = ? AND user_id = ?', [req.body.projectId, req.headers['user-id']])
    if (participations.rows.length == 0) {
      data = await turso.execute("INSERT INTO participations (user_id, project_id, role_id) VALUES (?, ?, ?)", [req.headers["user-id"], req.body.projectId, req.body.roleId])
    }
  }catch (e) {
    console.log(e)
    res.status(500)
    return
  }
  if (data.lastInsertRowid)
    res.json({ project: data.lastInsertRowid.toString()})
})

app.put('/api/projects/:id', async (req, res) => {
  let newValue
  console.log("archived" in req.body)
  try{
    if ("name" in req.body){
      newValue = req.body.name
      await turso.execute("UPDATE projects SET name = ? WHERE id = ?", [req.body.name, req.params.id])
    }
    if ("archived" in req.body){
      newValue = req.body.archived? 1 : 0
      await turso.execute("UPDATE projects SET archived = ? WHERE id = ?", [req.body.archived, req.params.id])
    }
  }catch (e) {
    res.status(500)
    return
  }
  res.status(200).json({ project: {id: req.params.id, newValue: newValue} })
})

app.delete('/api/projects/:id', async (req, res) => {
  try{
    await turso.execute("DELETE FROM notifications WHERE project_id = ?", [req.params.id])
    await turso.execute("DELETE FROM events WHERE project_id = ?", [req.params.id])
    const items = await turso.execute("SELECT id FROM items WHERE project_id = ?", [req.params.id])
    await turso.execute("DELETE FROM item_attributes WHERE item_id IN (" + items.rows.map((item) => item.id).join(",") + ")")
    await turso.execute("DELETE FROM items WHERE project_id = ?", [req.params.id])
    const attrs = await turso.execute("SELECT id FROM attributes WHERE project_id = ?", [req.params.id])
    await turso.execute("DELETE FROM role_attributes WHERE attribute_id IN (" + attrs.rows.map((attr) => attr.id).join(", ") + ")")
    await turso.execute("DELETE FROM attributes WHERE project_id = ?", [req.params.id])
    await turso.execute("DELETE FROM participations WHERE project_id = ?", [req.params.id])
    await turso.execute("DELETE FROM roles WHERE project_id = ?", [req.params.id])
    await turso.execute("DELETE FROM messages WHERE project_id = ?", [req.params.id])
    await turso.execute("DELETE FROM projects WHERE id = ?", [req.params.id])
  }catch (e) {
    console.error(e)
    res.status(500)
    return
  }
  res.status(200).json({ project: {id: req.params.id} })
})

//region Events
app.get('/api/users/:id/events', async (req, res) => {
  data = await turso.execute("SELECT * FROM events\
        INNER JOIN attributes on attributes.id = events.tag_id\
        INNER JOIN participations on participations.project_id = attributes.project_id\
        INNER JOIN roles on roles.id = participations.role_id\
        WHERE user_id = ? AND roles.name='admin'", [req.params.id])
  data = data.rows.map((event) => {event.title = event.name 
    event.date = event.start_time.split(' ')[0] 
    event.end = event.end_time.split(' ')[0] 
    event.start_time = event.start_time.split(' ')[1] 
    event.end_time = event.end_time.split(' ')[1] 
    return event})
  res.json({ events: data })
})

app.get('/api/projects/:id/events', async (req, res) => {
  if (!req.headers["user-id"]){
    res.status(401).json({ error: "Missing userId" })
    return
  }
  if (isAdmin(req.headers["user-id"], req.params.id))
    data = await turso.execute("SELECT * FROM events\
      INNER JOIN attributes on attributes.id = events.tag_id\
      INNER JOIN participations on attributes.project_id = participations.project_id\
      WHERE participations.project_id = ?", [req.params.id])
  else
    data = await turso.execute("SELECT * FROM events\
      INNER JOIN role_attributes on role_attributes.attribute_id = events.tag_id\
      INNER JOIN participations on role_attributes.role_id = participations.role_id\
      WHERE participations.project_id = ? and user_id = ? AND role_attributes.level >= ?", [req.params.id, req.headers["user-id"], LEVEL_VIEW])
  data = data.rows.map((event) => {event.title = event.name 
    event.start = event.start_time.split(' ')[0] 
    event.end = event.end_time.split(' ')[0] 
    event.start_time = event.start_time.split(' ')[1] 
    event.end_time = event.end_time.split(' ')[1] 
    return event})
  res.json({ events: data })
})

app.post('/api/projects/:id/events', async (req, res) => {
  const startTime = req.body.date+' '+req.body.start
  const endTime = req.body.date+' '+req.body.end
  data = await turso.execute('INSERT INTO events (name, start_time, end_time, tag_id, description) VALUES (?, ?, ?, ?, ?)', 
    [req.body.name, startTime, endTime, req.body.tag, req.body.description]
  )
  res.json({ event: data.lastInsertRowid.toString() })
})

//region Messages & Notifications
async function getMessages(params) {
  var data = []
  if (params.userId) {
    data = await turso.execute('SELECT messages.id, users.id as userId, users.username, text, name.value, comment_value, attributes.name FROM messages\
      LEFT JOIN item_attributes as cell ON cell.id = messages.comment_cell\
      LEFT JOIN items ON items.id = cell.item_id\
      LEFT JOIN attributes ON attributes.id = cell.attribute_id\
      INNER JOIN participations ON participations.project_id = messages.project_id\
      INNER JOIN users ON users.id = messages.author_id\
      LEFT JOIN item_attributes name ON name.item_id = items.id\
      WHERE participations.user_id = ?\
      ORDER BY messages.id, name.id', [params.userId])
    data = data.rows.reduce(([list, ids], message)=>{if (!(ids.includes(message.id))){ids.push(message.id); list.push(message)} return [list, ids]}, [[],[]])[0]
  } else if (params.projectId) {
    data = await turso.execute('SELECT messages.id, users.id as userId, users.username, text, name.value, comment_value, attributes.name FROM messages\
      LEFT JOIN item_attributes as cell ON cell.id = messages.comment_cell\
      LEFT JOIN items ON items.id = cell.item_id\
      LEFT JOIN attributes ON attributes.id = cell.attribute_id\
      INNER JOIN users ON users.id = messages.author_id\
      LEFT JOIN item_attributes name ON name.item_id = items.id\
      WHERE messages.project_id = ?\
      ORDER BY messages.id, name.id', [params.projectId])
    data = data.rows.reduce(([list, ids], message)=>{if (!(ids.includes(message.id))){ids.push(message.id); list.push(message)} return [list, ids]}, [[],[]])[0]
  }
  return data
}

app.get('/api/projects/:id/messages', async (req, res) => {
  if (!req.headers["user-id"]){
    res.status(401).json({ error: "Missing userId" })
    return
  }
  let data = await getMessages({'projectId': req.params.id})
  res.json({ messages: data.reverse() })
})

app.post('/api/projects/:id/messages', async (req, res) => {
  if (!req.headers["user-id"]){
    res.status(401).json({ error: "Missing userId" })
    return
  }
  if (!req.body.text){
    res.status(400).json({ error: "Missing text" })
    return
  }

  if (!req.body.comment){
    data = await turso.execute("INSERT INTO messages (project_id, author_id, text) VALUES (?, ?, ?)", [req.params.id, req.headers["user-id"], req.body.text])
  }else{
    let cellId = await turso.execute("SELECT id FROM item_attributes WHERE item_id = ? AND attribute_id = ?", [req.body.comment.row, req.body.comment.column])
    cellId = cellId.rows[0].id
    data = await turso.execute("INSERT INTO messages (project_id, author_id, text, comment_cell, comment_value) VALUES (?, ?, ?, ?, ?)", [req.params.id, req.headers["user-id"], req.body.text, cellId, req.body.comment.value])
    notify('comment', {projectId: req.params.id, messageId: data.lastInsertRowid})
  }
  res.json({ message: data.lastInsertRowid.toString() })
})

async function notify(type, params) {
  try{
    if(!params.projectId)
      return null
    if (type == 'comment' && params.messageId){
      data = await turso.execute("INSERT INTO notifications (project_id, message_id) VALUES (?, ?)", [params.projectId, params.messageId])
    } else if (type == 'change' && params.cellId && params.oldValue && params.newValue){
      data = await turso.execute("INSERT INTO notifications (project_id, cell_id, new_value, old_value) VALUES (?, ?, ?, ?)", [params.projectId, params.cellId, params.newValue, params.oldValue])
    }
    return data.lastInsertRowid.toString()
  } catch (e) {
    console.log(e)
    return null
  }
}

app.get('/api/projects/:id/notifications', async (req, res) => {
  if (!req.headers["user-id"]){
    res.status(401).json({ error: "Missing userId" })
    return
  }

  let data = await turso.execute("SELECT notifications.*, messages.*, name.value, attributes.name, comment_user.username, change_user.username FROM notifications\
    LEFT JOIN messages ON messages.id = notifications.message_id\
    LEFT JOIN users comment_user ON comment_user.id = messages.author_id\
    LEFT JOIN users change_user ON change_user.id = notifications.change_author\
    LEFT JOIN item_attributes ON item_attributes.id = notifications.cell_id\
    LEFT JOIN attributes ON attributes.id = item_attributes.attribute_id\
    LEFT JOIN item_attributes name ON name.item_id = item_attributes.item_id\
    WHERE notifications.project_id = ?\
    ORDER BY notifications.id, name.id", [req.params.id])
    
    data = data.rows.reduce(([list, ids], notification)=>{
      if (!(ids.includes(notification.id))){
        ids.push(notification.id); list.push(notification)
      } 
      return [list, ids]}, [[],[]])[0]

    const messages = await getMessages({'userId':req.headers['user-id']})
    data.forEach((notification) => {
    if (notification.message_id){
      notification.comment = messages.find((message) => message.id == notification.message_id)
    }
  })
  
  res.json({ notifications: data.reverse() })
})

app.get('/api/users/:id/notifications', async (req, res) => {
  if (req.headers["user-id"] != req.params.id){
    res.status(409).json({ error: "User id does not match" })
  }

  let data = await turso.execute("SELECT notifications.*, messages.text, messages.comment_cell, messages.comment_value, attributes.name, name.value, users.username FROM notifications\
    LEFT JOIN messages ON messages.id = notifications.message_id\
    LEFT JOIN users ON users.id = messages.author_id OR users.id = notifications.change_author\
    LEFT JOIN item_attributes ON item_attributes.id = notifications.cell_id\
    LEFT JOIN attributes ON attributes.id = item_attributes.attribute_id\
    LEFT JOIN item_attributes name ON name.item_id = item_attributes.item_id\
    INNER JOIN participations ON participations.project_id = notifications.project_id\
    WHERE participations.user_id = ?", [req.params.id])
  data = data.rows.reduce(([list, ids], notification)=>{
    if (!(ids.includes(notification.id))){
      ids.push(notification.id); list.push(notification)
    } 
    return [list, ids]}, [[],[]])[0]
  const messages = await getMessages({'userId': req.params.id})
  data.forEach((notification) => {
    if (notification.message_id){
      notification.comment = messages.find((message) => message.id == notification.message_id)
    }
  })
  
  res.json({ notifications: data.reverse() })
})

app.put('/api/users/:id/notifications', async (req, res) => {
  if (req.headers["user-id"] != req.params.id){
    res.status(409).json({ error: "User id does not match" })
  }

  [project, value] = Object.entries(req.body)[0]

  const data = await turso.execute("UPDATE participations SET last_notification = ? WHERE project_id = ? AND user_id = ?", [value, project, req.params.id])
  res.json({ notifications: data.rows })
})

//region Roles
app.get('/api/projects/:id/roles', async (req, res) => {
  data = await turso.execute("SELECT * FROM roles WHERE project_id = ?", [req.params.id])
  res.json({ roles: data.rows })
})

app.post('/api/projects/:id/roles', async (req, res) => {
  //TODO: Check if name is already taken
  rolePromise = turso.execute("INSERT INTO roles (name, project_id) VALUES (?, ?)", [req.body.name, req.params.id])
  attributesPromise = turso.execute("SELECT * FROM attributes WHERE project_id = ?", [req.params.id])
  const [role, attributes] = await Promise.all([rolePromise, attributesPromise])
  for (let i = 0; i < attributes.rows.length; i++) {
    turso.execute("INSERT INTO role_attributes (role_id, attribute_id, level) VALUES (?, ?, 0)", [role.lastInsertRowid, attributes.rows[i].id])
  }

  res.json({ roleId: role.lastInsertRowid.toString() })
})

app.get('/api/projects/:pid/roles/:rid', async (req, res) => {
  /*if (req.params.rid == "admin"){
    res.json({ permissions: [] })
    return
  }*/
  data = await turso.execute("SELECT * FROM role_attributes \
    INNER JOIN attributes ON attributes.id = role_attributes.attribute_id \
    WHERE project_id = ? AND role_id = ? ORDER BY role_attributes.attribute_id", [req.params.pid, req.params.rid])
  res.json({ permissions: data.rows })
})

app.put('/api/projects/:pid/roles/:rid', async (req, res) => {
  queries = []
  for (let attrId in req.body.permissions){
    queries.push(turso.execute("UPDATE role_attributes SET level = ? WHERE role_id = ? AND attribute_id = ?", [req.body.permissions[attrId], req.params.rid, attrId]))
  }
  Promise.all(queries).then((results) => {
    res.json({ role: {id: req.params.rid} })
  })
})

app.get('/api/projects/:id/users', async (req, res) => {
  data = await turso.execute("SELECT * FROM users\
      INNER JOIN participations on participations.user_id = users.id\
      INNER JOIN roles on roles.id = participations.role_id\
      WHERE participations.project_id = ?", [req.params.id])
  res.json({ users: data.rows })
})

app.put('/api/projects/:id/users', async (req, res) => {
  if (!hasPermission(req.headers['user-id'], req.params.id, 'admin')){
    res.status(401).json({ error: "Missing permissions" })
    return
  }
  data = await turso.execute('UPDATE participations SET role_id = ? WHERE user_id = ? AND project_id = ?', [req.body.roleId, req.body.userId, req.params.id])
  res.json({ user: data.rows[0] })
})

app.get('/api/users/:id/roles/', async (req, res) => {
  data = await turso.execute("SELECT * FROM participations\
    INNER JOIN roles ON roles.id = participations.role_id\
    WHERE user_id = ?", [req.params.id])
  res.json({ roles: data.rows })
})

//region User Accounts
async function sha256(message) {
  //https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
  const msgBuffer = new TextEncoder().encode(message)                    

  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)

  const hashArray = Array.from(new Uint8Array(hashBuffer))
       
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

app.post('/api/login', async (req, res) => {
  
  if (!req.body.email) {
    res.status(400).json({ error: "Introduce un correo electrónico" })
    return
  }
  if (!req.body.password) {
    res.status(400).json({ error: "Introduce una contraseña" })
    return
  }

  if (!req.body.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    res.status(400).json({ error: "Correo electrónico no válido" })
    return
  }

  const hashPassword = await sha256(req.body.password)

  data = await turso.execute("SELECT * FROM users WHERE email = ? AND password = ?", [req.body.email, hashPassword])
  if (data.rows.length == 0)
    res.status(401).json({ error: "Correo electrónico o contraseña incorrectos" })
  else
    res.json({ user: data.rows[0] })
})

app.post('/api/register', async (req, res) => {
  if (!req.body.email) {
    res.status(400).json({ error: "Introduce un correo electrónico" })
    return
  }
  if (!req.body.password) {
    res.status(400).json({ error: "Introduce una contraseña" })
    return
  }

  if (!req.body.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    res.status(400).json({ error: "Correo electrónico no válido" })
    return
  }

  data = await turso.execute("SELECT * FROM users WHERE email = ?", [req.body.email])
  if (data.rows.length > 0) {
    res.status(409).json({ error: "Correo electrónico en uso" })
    return
  }


  const hashPassword = await sha256(req.body.password)
  const username = req.body.email.split('@')[0]

  newUser = await turso.execute("INSERT INTO users (email, username, password) VALUES (?, ?, ?)", [req.body.email, username, hashPassword])
  res.json({ userId: newUser.lastInsertRowid.toString(), username: username })
})

app.put('/api/users/:id', async (req, res) => {

  if (req.body.email && !req.body.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    res.status(400).json({ error: "Invalid email" })
    return
  }

  if (req.body.password){
    hashPassword = await sha256(req.body.password)
    await turso.execute("UPDATE users SET password = ? WHERE id = ?", [hashPassword, req.params.id])
  }
  if (req.body.email)
    await turso.execute("UPDATE users SET email = ? WHERE id = ?", [req.body.email, req.params.id])
  if (req.body.username)
    await turso.execute("UPDATE users SET username = ? WHERE id = ?", [req.body.username, req.params.id])
  res.status(200)
})

//region Spreadsheets
app.get('/api/projects/:id/items', async (req, res) => {
  if (!req.headers['attributes']){
    res.status(400).json({ error: "Missing attributes" })
    return
  }
  let attributes = req.headers['attributes'].split(",")
  attributes = attributes.filter((attr) => hasPermission(req.headers["user-id"], req.params.id, attr, LEVEL_VIEW))

  const data = await turso.execute("SELECT * FROM items\
    INNER JOIN item_attributes ON item_attributes.item_id = items.id\
    WHERE items.project_id = ? AND attribute_id IN (" + attributes.join(", ") + ")", [req.params.id])
  
  let items = data.rows.reduce((items, item) => {if (!items[item.id]) items[item.id] = {}; if (!items[item.id].spreadsheet) items[item.id].spreadsheet=item.spreadsheet; items[item.id][item.attribute_id] = item.value; return items}, {})
  items = Object.entries(items).map(([item, attrs]) => {
    newAttrs = {...attrs}
    newAttrs['id'] = item
    return newAttrs
  })
  res.json({ items: items })
})

app.post('/api/projects/:id/items', async (req, res) => {
  attributes = req.body.attributes
  promises = Object.keys(attributes).map(async (attr) => [attr, attributes[attr], await hasPermission(req.headers['user-id'], req.params.id, attr, LEVEL_EDIT)])
  allowedAttributes = (await Promise.all(promises)).filter(([attr, value, permission]) => permission)

  if (allowedAttributes.length == 0){
    res.status(401).json({ error: "Missing permissions" })
    return
  }
  data = await turso.execute("INSERT INTO items (project_id, spreadsheet) VALUES (?, ?)", [req.params.id, req.body.spreadsheet])
  for (const [attr, value, permission] of allowedAttributes) {
    if (!permission)
      continue
    turso.execute("INSERT INTO item_attributes (item_id, attribute_id, value) VALUES (?, ?, ?)", [data.lastInsertRowid, attr, value])
  }
  res.json({ item: data.rows[0] })
})

app.put('/api/projects/:pId/items/:iId', async (req, res) => {
  attributes = req.body.attributes
  for (let [attr, value] of Object.entries(attributes)) {
    if (await hasPermission(req.headers['user-id'], req.params.pId, attr, LEVEL_EDIT)) {
      const oldData = await turso.execute("SELECT * FROM item_attributes WHERE item_id = ? AND attribute_id = ?", [req.params.iId, attr])
      if (oldData.rows[0] == null){
        data = await turso.execute("INSERT INTO item_attributes (item_id, attribute_id, value) VALUES (?, ?, ?)", [req.params.iId, attr, value])
        notify('change', {projectId: req.params.pId, cellId: data.lastInsertRowid, newValue: value, oldValue: null})
        res.json({ item: data.lastInsertRowid.toString() })
      } else {
        const oldValue = oldData.rows[0].value
        if (oldValue != value){
          data = await turso.execute("UPDATE item_attributes SET value = ?, last_editor = ? WHERE item_id = ? AND attribute_id = ?", [value, req.headers['user-id'], req.params.iId, attr])
          notify('change', {projectId: req.params.pId, cellId: oldData.rows[0].id, newValue: value, oldValue: oldValue})
          res.json({ item: data.rows[0] })
        } else {
          res.json({ item: oldData.rows[0] })
        }
      }
    } else {
      res.status(401).json({ error: "Missing permissions" })
      return
    }
  }
})

app.get('/api/projects/:id/attributes', async (req, res) => {
  let data;
  if (await isAdmin(req.headers["user-id"], req.params.id)) {
    data = await turso.execute("SELECT * FROM attributes WHERE project_id = ?", [req.params.id])
  } else {
    data = await turso.execute("SELECT * FROM attributes\
      WHERE attributes.project_id = ? AND attributes.id IN \
      (SELECT attribute_id FROM role_attributes\
      INNER JOIN participations ON participations.role_id = role_attributes.role_id\
      WHERE participations.user_id = ? AND role_attributes.level >= ?)", [req.params.id, req.headers["user-id"], LEVEL_VIEW])
  }
  res.json({ attributes: data.rows })
})

app.post('/api/projects/:id/attributes', async (req, res) => {
  if (hasPermission(req.headers["user-id"], req.params.id, "columns", LEVEL_EDIT)){
    const data = await turso.execute("INSERT INTO attributes (name, project_id, spreadsheet) VALUES (?, ?, ?)", [req.body.name, req.params.id, req.body.spreadsheet])
    const roles = await turso.execute("SELECT * FROM roles \
      LEFT JOIN participations ON participations.role_id = roles.id \
      WHERE roles.project_id = ?", [req.params.id])
    for (let i = 0; i < roles.rows.length; i++) {
      if (roles.rows[i].user_id == req.headers["user-id"] || roles.rows[i].name == "admin")
        turso.execute("INSERT INTO role_attributes (role_id, attribute_id, level) VALUES (?, ?, 2)", [roles.rows[i].id, data.lastInsertRowid])
      else
        turso.execute("INSERT INTO role_attributes (role_id, attribute_id, level) VALUES (?, ?, 0)", [roles.rows[i].id, data.lastInsertRowid])
    }
    res.json({ attributeId: data.lastInsertRowid.toString() })
  } else 
    res.status(401).json({ error: "No permission" })
})

app.put('/api/projects/:pid/attributes/:aid', async (req, res) => {
  if (hasPermission(req.headers["user-id"], req.params.pid, "columns", LEVEL_EDIT)){
    data = await turso.execute("UPDATE attributes SET name = ? WHERE id = ?", [req.body.name, req.params.aid])
    res.json({ spreadsheet: data.rows[0] })
  } else
    res.status(401).json({ error: "No permission" })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:`+port)
})

module.exports.handler = serverless(app)