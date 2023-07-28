const express = require('express')
const router = express.Router()

// Controllers
const entries_controller = require('../controllers/entries_controller.js')

// Middlewares
const userExists = require('../middlewares/user_exists.js')
const authUser = require('../middlewares/auth_user.js')

// GET /entries/
router.get('/', entries_controller.getEntries)

// POST /entries
router.post('/', authUser, userExists, entries_controller.createEntry)

// GET /entries/:id
router.get('/:id', entries_controller.getEntry)

// PUT /entries/:id
router.put('/:id', entries_controller.editEntry)

// PATCH /entries/:id
router.patch('/:id', entries_controller.editEntry)

// DELETE /entries/:id
router.delete('/:id', entries_controller.deleteEntry)

// GET /entries/:id/photos
router.get('/:id/photos', entries_controller.getEntryPhotos)

// POST /entries/:id/photos
router.post('/:id/photos', authUser, userExists, entries_controller.addEntryPhoto)

// DELETE /entries/:id/photos/:photoId
router.delete('/:id/photos/:photoId', authUser, userExists, entries_controller.deleteEntryPhoto)


module.exports = router
