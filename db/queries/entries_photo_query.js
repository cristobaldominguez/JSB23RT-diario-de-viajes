const getPool = require('../pool.js')

async function getEntryPhotos({ id }) {
  let connection

  try {
    connection = await getPool()

    const [photos] = await connection.query(
      `SELECT * FROM entryPhotos WHERE entryId = ?`,
      [id]
    )

    return photos

  } catch (error) {
    console.log(error)
    return error

  } finally {
    if (connection) connection.release()
  }
}

async function insertPhoto(photoName, entryId) {
  let connection

  try {
    connection = await getPool()

    const [photo] = await connection.query(
      `INSERT INTO entryPhotos(name, entryId, createdAt) VALUES(?, ?, ?)`,
      [photoName, entryId, new Date()]
    )

    return {
      id: photo.insertId,
      name: photoName,
    }

  } catch (error) {
    console.log(error)
    return error

  } finally {
    if (connection) connection.release()
  }
}

module.exports = {
  getEntryPhotos,
  insertPhoto
}
