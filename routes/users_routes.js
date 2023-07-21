const express = require('express')
const router = express.Router()

// Controllers
const users_controller = require('../controllers/users_controller.js')

// Middlewares
const authUser = require('../middlewares/auth_user.js')
const userExists = require('../middlewares/user_exists.js')

// GET /users/
router.get('/', users_controller.getUsers)

// GET /users/:id
router.get('/:id', authUser, userExists, users_controller.getUser)

// POST /users/
router.post('/', users_controller.createUser)

// POST /users/login
router.post('/login', users_controller.loginUser)

module.exports = router
