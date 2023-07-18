const express = require('express')

const { port } = require('./config')

const app = express()

app.get('/', (req, res) => {
  res.json({ msg: 'Aleluya!' })
})

app.use((req, res, next) => {
  res.status(404)
  res.json({ error: true, msg: '404 Not Found' })
})

app.listen(port, _ => `Server running at: http://localhost:${port}`)
