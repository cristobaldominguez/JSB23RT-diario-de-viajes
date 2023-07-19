const getPool = require('./pool.js')

const init = async () => {
  let connection

  try {
    connection = await getPool()

    console.log('Borrando tablas')
    await connection.query('DROP TABLE IF EXISTS users')

    console.log('Creando tablas')
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users(
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(30) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        avatar VARCHAR(100),
        role ENUM('admin', 'normal') DEFAULT 'normal',
        registration_code VARCHAR(100),
        recoveryPassCode VARCHAR(100),
        active BOOLEAN DEFAULT false,
        createdAt DATETIME NOT NULL DEFAULT NOW(),
        modifiedAt DATETIME
      )
    `)

    await connection.query(`
        INSERT INTO users (email, username, password, registration_code, active, role)
          VALUES('user@example.com', 'usuario01', '123123', '001', 1, 'admin'),
                ('user2@example.com', 'usuario02', '123123', '001', 1, 'normal'),
                ('user3@example.com', 'usuario03', '123123', '001', 1, 'normal'),
                ('user4@example.com', 'usuario04', '123123', '001', 1, 'normal');
    `)

    console.log('Tablas creadas')
    
  } catch (error) {
    console.error(error)
  } finally {
    if (connection) connection.release()
    process.exit()
  }
}

init()
