const ValidationError = require('../errors/validation_error.js')
const {
  getEntries: getEntriesDB,
  createEntry: createEntryDB,
  getEntry: getEntryDB,
  editEntry: editEntryDB,
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

    const entry = await createEntryDB({ title, place, description, userId })
    const savedEntry = await getEntryDB({ id: entry.insertId })
    res.json({ savedEntry })

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

async function editEntry(req, res, next) {
  const { id } = req.params
  const { title, place, description } = req.body

  if (Object.keys(req.body).length < 1) 
    throw new ValidationError({ message: 'Los campos title, place o description son obligatorios', field: 'title' })

  try {
    const entry = await getEntryDB({ id })
    const newEntry = {
      ...entry,
      title: title || entry.title,
      place: place || entry.place,
      description: description || entry.description
    }

    const editedEntry = await editEntryDB(newEntry)
    const savedEntry = editedEntry && await getEntryDB({ id })
    res.json({ savedEntry })

  } catch (error) {
    next(error)
  }
}

module.exports = {
  getEntries,
  createEntry,
  getEntry,
  deleteEntry,
  editEntry
}
