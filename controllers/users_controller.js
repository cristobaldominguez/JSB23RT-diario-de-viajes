const crypto = require('crypto')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { 
  getUserBy,
  getUsers: getUsersDB,
  getUser: getUserDB,
  createUser: createUserDB,
} = require('../db/queries/users_query.js')

// Errors
const ValidationError = require('../errors/validation_error.js')
const AuthError = require('../errors/auth_error.js')

async function getUsers(req, res) {
  const users = await getUsersDB()

  res.json({ users })
}

async function getUser(req, res) {
  const { id } = req.params
  const user = await getUserDB({ id })
  res.json({ user })
}

async function createUser(req, res, next) {
  try {
    const { email, username, password } = req.body

    if (!email) throw new ValidationError({ message: 'El campo email es obligatorio', field: 'email' })
    if (!password) throw new ValidationError({ message: 'El campo password es obligatorio', field: 'password' })
    if (!username) throw new ValidationError({ message: 'El campo username es obligatorio', field: 'username' })

    // Generamos el código de registro.
    const registrationCode = crypto.randomUUID()

    // Insertamos al usuario en la base de datos.
    const user = await createUserDB({ email, username, password, registrationCode })
    if (user.is_an_error) throw user

    res.send({
      status: 'ok',
      message: 'Usuario creado, revisa el email de verificación',
    })
  } catch (err) {
    next(err)
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body
    
    if (!email) throw new ValidationError({ message: 'El campo email es obligatorio', field: 'email' })
    if (!password) throw new ValidationError({ message: 'El campo password es obligatorio', field: 'password' })

    const user = await getUserBy({ email })

    // Comprobamos si las contraseñas coinciden.
    const validPass = await bcrypt.compare(password, user.password)

    // Si no coinciden lanzamos un error.
    if (!validPass) {
      throw new AuthError({ message: 'Usuario o contraseña incorrectos', status: 401 })
    }

    // Objeto con info que queremos agregar al token.
    const tokenInfo = {
      id: user.id,
      role: user.role,
    }

    // Creamos el token.
    const token = jwt.sign(tokenInfo, process.env.SECRET, {
      expiresIn: '7d',
    })

    res.send({
      status: 'ok',
      data: {
        token,
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  loginUser
}
