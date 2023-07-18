const express = require('express')

const { port } = require('./config')

const app = express()



app.listen(port, _ => `Server running at: http://localhost:${port}`)
