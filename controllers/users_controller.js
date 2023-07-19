const { 
  getUsers: getUsersDB,
  getUser: getUserDB
} = require('../db/queries/users_query.js')

async function getUsers(req, res) {
  const users = await getUsersDB()

  res.json({ users })
}

async function getUser(req, res) {
  const { id } = req.params
  const user = await getUserDB({ id })
  res.json({ user })
}

module.exports = {
  getUsers,
  getUser
}
