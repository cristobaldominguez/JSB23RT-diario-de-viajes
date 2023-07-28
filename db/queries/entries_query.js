const getPool = require('../pool.js')

async function getEntries() {
  let connection

  try {
    connection = await getPool()
    const [ entries ] = await connection.query(`SELECT * FROM entries`)
    return entries

  } catch (error) {
    
  }
}

async function createEntry({ title, place, description, userId }) {
  let connection

  try {
    connection = await getPool()
    const [savedData] = await connection.query(
      `INSERT INTO entries(title, place, description, userId, createdAt) VALUES(?, ?, ?, ?, ?)`,
      [title, place, description, userId, new Date()]
    )
    return savedData

  } catch (error) {
    
  }
}

async function getEntryBy(obj) {
  const query_str = Object.entries(obj).map(arr => `${arr[0]} = '${arr[1]}'`).join(' AND ')
  let connection

  try {
    connection = await getPool()
    const [ entries ] = await connection.query(
      `SELECT * FROM entries WHERE ${query_str}`
    )
    return entries[0]

  } catch (error) {
    console.log(error)
    return error

  } finally {
    if (connection) connection.release()
  }
}

async function getEntryWithPhotos({ id, userId }) {
  let connection

  try {
    connection = await getPool()
    const [ entries ] = await connection.query(
      `SELECT * FROM entries INNER JOIN entryPhotos ON entries.id = entryPhotos.entryId WHERE entries.id = ? AND entries.userId = ?`,
      [id, userId]
    )
    return entries

  } catch (error) {
    console.log(error)
    return error

  } finally {
    if (connection) connection.release()
  }
}

async function getEntryPhoto({ entryId, photoId }) {
  let connection

  try {
    connection = await getPool()
    const [ photos ] = await connection.query(
      `SELECT * FROM entryPhotos WHERE entryId = ? AND id = ?`,
      [entryId, photoId]
    )
    return photos[0]

  } catch (error) {
    console.log(error)
    return error

  } finally {
    if (connection) connection.release()
  }
}

async function getEntry({ id }) {
  let connection

  try {
    connection = await getPool()
    const [ entry ] = await connection.query(
      `SELECT * FROM entries WHERE id = ?`,
      [ id ]
    )
    return entry[0]

  } catch (error) {
    
  }
}

async function editEntry({ id, title, place, description, userId }) {
  let connection

  try {
    connection = await getPool()
    const entry = await connection.query(
      `UPDATE entries SET title = ?, place = ?, description = ? WHERE id = ? AND userId = ?`,
      [ title, place, description, id, userId ]
    )
    return entry

  } catch (error) {
    
  }
}

async function deleteEntry({ id }) {
  let connection

  try {
    connection = await getPool()
    const data = await connection.query(
      `DELETE FROM entries WHERE id = ?`,
      [ id ]
    )
    return data

  } catch (error) {
    
  }
}

async function deletePhoto({ photoId }) {
  let connection

  try {
    connection = await getPool()
    const data = await connection.query(
      `DELETE FROM entryPhotos WHERE id = ?`,
      [ photoId ]
    )
    return data

  } catch (error) {
    
  }
}

async function getPhotosFromEntry({ entryId }) {
  let connection

  try {
    connection = await getPool()
    const [ entry ] = await connection.query(
      `SELECT * FROM entryPhotos WHERE entryId = ?`,
      [ entryId ]
    )
    return entry

  } catch (error) {
    
  }
}

module.exports = {
  getEntries,
  createEntry,
  getEntryBy,
  getEntry,
  editEntry,
  deleteEntry,
  getEntryWithPhotos,
  getEntryPhoto,
  deletePhoto,
  getPhotosFromEntry
}
