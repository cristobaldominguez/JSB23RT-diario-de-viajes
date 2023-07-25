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

module.exports = {
  getEntries,
  createEntry,
  getEntry,
  editEntry,
  deleteEntry
}
