function errorMiddleware(err, req, res, next) {
  if (err.is_an_error) {
    return res.status(err.status).json(err.toJson())
  }

  res.status(500)
  res.json({
    error: {
      status: 500,
      name: 'UnknownError',
      message: 'Error no conocido'
    }
  })
}

module.exports = errorMiddleware
