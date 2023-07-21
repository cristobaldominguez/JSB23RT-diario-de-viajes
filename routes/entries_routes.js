const express = require('express')
const router = express.Router()

// Controllers
const entries_controller = require('../controllers/entries_controller.js')

// Middlewares
const userExists = require('../middlewares/user_exists.js')

// GET /entries/
router.get('/', entries_controller.getEntries)

// GET /entries/:id
router.get('/:id', entries_controller.getEntry)

// POST /entries
router.post('/', userExists, entries_controller.createEntry)

// PUT /entries/:id
router.put('/:id', entries_controller.editEntry)

// PATCH /entries/:id
router.patch('/:id', entries_controller.editEntry)

// DELETE /entries/:id
router.delete('/:id', entries_controller.deleteEntry)

module.exports = router
