function userExists(req, res, next) {
  req.user = {
    id: 1
  }
  
  next()
}

module.exports = userExists;
