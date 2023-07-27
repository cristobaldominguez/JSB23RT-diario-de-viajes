const crypto = require('node:crypto')

function randomDigits({ init = 100000000, last = 1000000000 } = {}) {
  return crypto.randomInt(init, last).toString()
}

module.exports = randomDigits
