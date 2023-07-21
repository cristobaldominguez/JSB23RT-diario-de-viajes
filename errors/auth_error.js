const CustomError = require('./custom_error.js')

class AuthError extends CustomError {
  constructor({ message, status = 403 }) {
    super(message)

    this.name = 'AuthError'
    this.status = status
  }
}

module.exports = AuthError
