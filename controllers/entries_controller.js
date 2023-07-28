const ValidationError = require('../errors/validation_error.js')
const AuthError = require('../errors/auth_error.js')
const {
  getEntryBy,
  getEntries: getEntriesDB,
  createEntry: createEntryDB,
  getEntry: getEntryDB,
  editEntry: editEntryDB,
  deleteEntry: deleteEntryDB,
  getEntryWithPhotos,
  getEntryPhoto,
  deletePhoto: deletePhotoDB,
  getPhotosFromEntry
} = require('../db/queries/entries_query.js')

const { getEntryPhotosDB, insertPhoto } = require('../db/queries/entries_photo_query.js')
const { savePhoto } = require('../services/photos.js')

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

async function addEntryPhoto(req, res, next) {
  try {
    const { id: entryId } = req.params

    // Si no hay foto lanzamos un error.
    if (!req.files?.photo) {
      throw new ValidationError({ message: 'Faltan campos' })
    }

    // const entry = await getEntryBy({ id: entryId, userId: req.user.id })
    const entry = await getEntryWithPhotos({ id: entryId, userId: req.user.id })

    // Si no somos los dueños de la entrada lanzamos un error.
    if (!entry) {
      throw new AuthError({ message: 'No tienes suficientes permisos' })
    }

    const entryPhotos = await getEntryPhotosDB({ id: entryId })

    // Si la entrada ya tiene tres fotos lanzamos un error.
    if (entryPhotos.length > 2) {
      throw new ValidationError({ message: 'Límite de tres fotos alcanzado', status: 403 })
    }

    // Guardamos la foto en la carpeta uploads y obtenemos el nombre que le hemos dado.
    const photoName = await savePhoto({ img: req.files.photo, width: 500 })

    // Guardamos la foto en la base de datos.
    const photo = await insertPhoto(photoName, entryId)
    if (photo instanceof Error) throw photo

    res.send({
      status: 'ok',
      data: {
        photo: {
          ...photo,
          entryId: Number(entryId),
        },
      },
    })
  } catch (err) {
    next(err)
  }
}

async function deleteEntryPhoto(req, res, next) {
  try {
    const { id: entryId, photoId } = req.params

    const entry = await getEntryBy({ id: entryId, userId: req.user.id })

    // Si no somos los dueños de la entrada lanzamos un error.
    if (!entry) {
      throw new AuthError({ message: 'No tienes suficientes permisos', status: 401 })
    }

    // Localizamos la foto en el array de fotos de la entrada.
    const photo = await getEntryPhoto({ entryId, photoId })

    // Si no hay foto lanzamos un error.
    if (!photo) {
      throw new ValidationError({ message: 'Foto no encontrada', status: 404 })
    }

    // Borramos la foto de la carpeta uploads.
    await deletePhoto(photo.name)

    // Borramos la foto en la base de datos.
    await deletePhotoDB({ photoId })

    res.send({
      status: 'ok',
      message: 'Foto eliminada',
    })
  } catch (err) {
    next(err)
  }
}

async function getEntryPhotos(req, res, next) {
  const { id: entryId } = req.params

  try {
    const photos = await getPhotosFromEntry({ entryId })

    res.send({
      status: 'ok',
      message: photos,
    })
    
  } catch (err) {
    next(err)
  }
}


module.exports = {
  getEntries,
  createEntry,
  getEntry,
  deleteEntry,
  editEntry,
  addEntryPhoto,
  deleteEntryPhoto,
  getEntryPhotos
}
