const ValidationError = require('../errors/validation_error.js')
const {
  getEntries: getEntriesDB,
  createEntry: createEntryDB,
  getEntry: getEntryDB,
  deleteEntry: deleteEntryDB
} = require('../db/queries/entries_query.js')

async function getEntries(req, res) {
  const entries = await getEntriesDB()

  res.json({ entries })
}

async function createEntry(req, res, next) {
  const { title, place, description } = req.body
  const { id: userId } = req.user

  try {
    if (!title) throw new ValidationError({ message: 'El campo title es obligatorio', field: 'title' })
    if (!place) throw new ValidationError({ message: 'El campo place es obligatorio', field: 'place' })
    if (!description) throw new ValidationError({ message: 'El campo description es obligatorio', field: 'description' })

    const entry = createEntryDB({ title, place, description, userId })
    res.json({ entry })

  } catch (error) {
    return next(error)
  }
}

async function getEntry(req, res) {
  const { id } = req.params

  const entry = await getEntryDB({ id })
  res.json({ entry })
}

async function deleteEntry(req, res) {
  const { id } = req.params
  const entry = await deleteEntryDB({ id })

  res.json(entry)
}

async function editEntry(req, res) {
  const { title, place, description } = req.body

  
  
}

module.exports = {
  getEntries,
  createEntry,
  getEntry,
  deleteEntry,
  editEntry
}
