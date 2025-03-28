const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');

app.use(cors())

app.get('/', (req, res) => {
  res.json({ projects: [{name: "Project AA", archived: false}, {name: "Project BB", archived: false}, {name: "Project CC", archived: true}, {name: "Project DD", archived: true}, {name: "Project EE", archived: false}, {name: "Project FF", archived: true}, {name: "Project GG", archived: false}, {name: "Project HH", archived: false}] });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
