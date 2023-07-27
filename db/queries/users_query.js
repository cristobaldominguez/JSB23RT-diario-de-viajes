const getPool = require('../pool.js')

// Errors
const AuthError = require('../../errors/auth_error.js')
const ValidationError = require('../../errors/validation_error.js')

async function getUsers() {
  let connection

  try {
    connection = await getPool()
    const [ users ] = await connection.query(`SELECT * FROM users`)
    return users

  } catch (error) {
    
  }
}

async function getUserBy(obj) {
  const query_str = Object.entries(obj).map(arr => `${arr[0]} = '${arr[1]}'`).join(', ')
  let connection

  console.log({ query_str })

  try {
    connection = await getPool()
    const [user] = await connection.query(
      `SELECT * FROM users WHERE ${query_str}`
    )
    return user[0]

  } catch (error) {

  } finally {
    if (connection) connection.release()
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
    return user[0]

  } catch (error) {
    
  }
}

async function createUser({ email, username, password, registrationCode }) {
  let connection

  try {
    connection = await getPool()

    // Comprobamos si el email está repetido.
    let [users] = await connection.query(
      `SELECT id FROM users WHERE email = ?`,
      [email]
    )

    // Si el array de usuarios tiene más de 0 usuarios quiere decir que el email está repetido.
    if (users.length > 0) {
      throw new AuthError({ message: 'Ya existe un usuario con ese email' })
    }

    // Comprobamos si el nombre de usuario está repetido.
    [users] = await connection.query(
      `SELECT id FROM users WHERE username = ?`,
      [username]
    )

    // Si el array de usuarios tiene más de 0 usuarios quiere decir que el nombre de usuario está repetido.
    if (users.length > 0) {
      throw new AuthError({ message: 'Nombre de usuario no disponible' })
    }

    // Insertamos el usuario en la base de datos.
    const [result] = await connection.query(
      `INSERT INTO users (email, username, password, registrationCode, createdAt) VALUES(?, ?, ?, ?, ?)`,
      [email, username, password, registrationCode, new Date()]
    )
    return await getUser({ id: result.insertId })

  } catch (error) {
    console.log(error)
    return error

  } finally {
    if (connection) connection.release()
  }
}

async function updateUserRegCode(regCode) {
  let connection

  try {
    connection = await getPool()

    // Intentamos localizar a un usuario con el código de registro que nos llegue.
    const [users] = await connection.query(
      `SELECT id FROM users WHERE registrationCode = ?`,
      [regCode]
    )

    // Si no hay usuarios con ese código de registro lanzamos un error.
    if (users.length < 1) throw new ValidationError({ message: 'Código no encontrado', status: 404 })

    const [user] = users

    // Actualizamos el usuario.
    await connection.query(
      `UPDATE users SET active = true, registrationCode = null, modifiedAt = ? WHERE id = ?`,
      [new Date(), user.id]
    )

  } catch (error) {
    console.log(error)
    return error

  } finally {
    if (connection) connection.release()
  }
}

async function updateUserRecoverPass({ id, recoverPassCode }) {
  let connection

  try {
    connection = await getPool()

    await connection.query(
      `UPDATE users SET recoveryPassCode = ?, modifiedAt = ? WHERE id = ?`,
      [recoverPassCode, new Date(), id]
    )

  } catch (error) {
    console.log(error)
    return error

  } finally {
    if (connection) connection.release()
  }
}

async function updateUserPass({ recoveryPassCode, newPass }) {
  let connection

  try {
    connection = await getPool()

    // Comprobamos si existe algún usuario con ese código de recuperación.
    const user = await getUserBy({ recoveryPassCode })

    // Si no hay ningún usuario con ese código de recuperación lanzamos un error.
    if (!user) throw new ValidationError({ message: 'Código de recuperación incorrecto', status: 404 })

    // Actualizamos el usuario.
    await connection.query(
      `UPDATE users SET password = ?, recoveryPassCode = null, modifiedAt = ? WHERE id = ?`,
      [newPass, new Date(), user.id]
    )

  } catch (error) {
    console.log(error)
    return error

  } finally {
    if (connection) connection.release()
  }
}

module.exports = {
  getUsers,
  getUserBy,
  getUser,
  createUser,
  updateUserRegCode,
  updateUserRecoverPass,
  updateUserPass
}