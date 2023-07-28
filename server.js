const express = require('express')
const fileUpload = require('express-fileupload')

const { port } = require('./config')

const { UPLOADS_DIR } = process.env

const app = express()

// Routes
const users_routes = require('./routes/users_routes.js')
const entries_routes = require('./routes/entries_routes.js')

// middlewares
const errorMiddleware = require('./middlewares/error_middleware.js')

// Middlewares
app.use(express.json())
app.use(fileUpload())
app.use(express.static(UPLOADS_DIR))

app.get('/', (req, res) => {
  res.json({ msg: 'Aleluya!' })
})

app.use('/users', users_routes)
app.use('/entries', entries_routes)

app.use((req, res, next) => {
  res.status(404)
  res.json({ error: true, msg: '404 Not Found' })
})

app.use(errorMiddleware)

app.listen(port, _ => `Server running at: http://localhost:${port}`)
