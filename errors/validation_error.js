const CustomError = require('./custom_error.js')

class ValidationError extends CustomError {
  constructor({ message, field }) {
    super(message)

    this.name = 'ValidationError'
    this.status = 403
    this.field = field
  }

  toJson() {
    const obj = super.toJson()
    obj['error']['field'] = this.field

    return obj
  }
}

module.exports = ValidationError