const express = require('express')
const router = express.Router()

// Controllers
const users_controller = require('../controllers/users_controller.js')

// GET /users/
router.get('/', users_controller.getUsers)

// GET /users/:id
router.get('/:id', users_controller.getUser)

module.exports = router
