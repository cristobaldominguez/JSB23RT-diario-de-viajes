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
    const data = await connection.query(
      `INSERT INTO entries(title, place, description, userId, createdAt) VALUES(?, ?, ?, ?, ?)`,
      [title, place, description, userId, new Date()]
    )
    console.log(data)
    return data[0]

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
    console.log(data)
    return data

  } catch (error) {
    
  }
}

module.exports = {
  getEntries,
  createEntry,
  getEntry,
  deleteEntry
}
