const express = require('express')

const { port } = require('./config')

const app = express()

// Routes
const users_routes = require('./routes/users_routes.js')

// endpoint (URL)
// Metodo (verbo)
// http://misitio.es/productos?limit=20&color=white

// Create, Read, Update, Delete (CRUD)
// POST, GET, PATCH/PUT, DELETE

app.get('/', (req, res) => {
  res.json({ msg: 'Aleluya!' })
})

app.use('/users', users_routes)

app.use((req, res, next) => {
  res.status(404)
  res.json({ error: true, msg: '404 Not Found' })
})

app.use((err, req, res, next) => {
  res.json({ error: true, msg: err.message })
})

app.listen(port, _ => `Server running at: http://localhost:${port}`)
