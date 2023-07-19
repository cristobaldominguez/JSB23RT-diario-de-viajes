const getPool = require('../pool.js')

async function getUsers() {
  let connection

  try {
    connection = await getPool()
    const [ users ] = await connection.query(`SELECT * FROM users`)
    return users

  } catch (error) {
    
  }
}

async function getUser({ id }) {
  let connection

  try {
    connection = await getPool()
    const [ user ] = await connection.query(
      `SELECT * FROM users WHERE id = ?`,
      [ id ]
    )
    return user

  } catch (error) {
    
  }
}

module.exports = {
  getUsers,
  getUser
}