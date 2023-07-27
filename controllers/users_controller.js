const crypto = require('node:crypto')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { 
  getUserBy,
  updateUserRegCode,
  getUsers: getUsersDB,
  getUser: getUserDB,
  createUser: createUserDB,
  updateUserRecoverPass,
  updateUserPass
} = require('../db/queries/users_query.js')

const randomDigits = require('../helpers/randomDigits.js')

// Email HTML Templates
const validationCodeTemplate = require('../mails/validationCode.js')
const recoveryPassword = require('../mails/recoveryPassword.js')

const sendMail = require('../services/sendMail.js')

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

    // Encriptamos la contraseña.
    const hashedPass = await bcrypt.hash(password, 10)

    // Insertamos al usuario en la base de datos.
    const user = await createUserDB({ email, username, password: hashedPass, registrationCode })
    if (user.is_an_error || user instanceof Error) throw user

    // Creamos el asunto del email de verificación.
    const emailSubject = 'Activa tu usuario en Diario de Viajes'

    // Creamos el contenido del email
    const emailBody = validationCodeTemplate(user)

    // Enviamos el email de verificación.
    const sentMail = await sendMail(email, emailSubject, emailBody)
    if (sentMail instanceof Error) throw sentMail

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

async function validateUser(req, res, next) {
  try {
    // Obtenemos el código de registro de los path params.
    const { regCode } = req.params

    // Activamos el usuario.
    const validation = await updateUserRegCode(regCode)
    if (validation instanceof Error) throw validation

    res.send({
      status: 'ok',
      message: 'Usuario activado',
    })
  } catch (err) {
    next(err)
  }
}

async function sendRecoverPass(req, res, next) {
  try {
    const { email } = req.body
    if (!email) throw new ValidationError({ message: 'Faltan campos', status: 400 })

    // Comprobamos que exista un usuario con ese email.
    const user = await getUserBy({ email })
    if (!user) throw user

    // Generamos el código de recuperación de contraseña.
    const recoverPassCode = randomDigits()

    // Insertamos el código de recuperación en la base de datos.
    await updateUserRecoverPass({ id: user.id, recoverPassCode })

    // Creamos el asunto del email de recuperación de contraseña
    const emailSubject = 'Recuperación de contraseña en Diario de Viajes'

    // Creamos el contenido del email.
    const emailBody = recoveryPassword({ recoverPassCode })

    // Enviamos el email de verificación.
    const sentMail = await sendMail(email, emailSubject, emailBody)
    if (sentMail instanceof Error) throw sentMail

    res.send({
      status: 'ok',
      message: 'Correo de recuperación enviado'
    })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

async function editUserPass(req, res, next) {
  try {
    const { recoveryPassCode, newPass } = req.body

    if (!newPass) throw new ValidationError({ message: 'El campo newPass es obligatorio', status: 400})
    if (!recoveryPassCode) throw new ValidationError({ message: 'El campo recoveryPassCode es obligatorio', status: 400})

    const hashedPass = await bcrypt.hash(newPass, 10)

    const updatedUser = await updateUserPass({ recoveryPassCode, newPass: hashedPass })
    if (updatedUser instanceof Error) throw updatedUser

    res.send({
      status: 'ok',
      message: 'Contraseña actualizada',
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  loginUser,
  validateUser,
  sendRecoverPass,
  editUserPass
}
