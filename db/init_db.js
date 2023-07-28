const getPool = require('./pool.js')

const init = async () => {
  let connection

  try {
    connection = await getPool()

    console.log('Borrando tablas')
    await connection.query('DROP TABLE IF EXISTS entryPhotos')
    await connection.query('DROP TABLE IF EXISTS entries')
    await connection.query('DROP TABLE IF EXISTS users')

    console.log('Creando tablas')
    console.log('Creando tabla users')
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users(
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(30) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        avatar VARCHAR(100),
        role ENUM('admin', 'normal') DEFAULT 'normal',
        registrationCode VARCHAR(100),
        recoveryPassCode VARCHAR(100),
        active BOOLEAN DEFAULT false,
        createdAt DATETIME NOT NULL DEFAULT NOW(),
        modifiedAt DATETIME
      )
    `)

    console.log('Creando tabla entries')
    await connection.query(`
      CREATE TABLE IF NOT EXISTS entries(
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(30) NOT NULL,
        place VARCHAR(30) NOT NULL,
        description TEXT NOT NULL,
        userId INT UNSIGNED NOT NULL,
        createdAt DATETIME NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
      );
    `)

    console.log('Creando tabla entryPhotos')
    await connection.query(`
      CREATE TABLE IF NOT EXISTS entryPhotos (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        entryId INT UNSIGNED NOT NULL,
        createdAt DATETIME NOT NULL,
        FOREIGN KEY (entryId) REFERENCES entries(id)
      )
    `);

    console.log('Tablas creadas')

    // // console.log('Agregando registros en tabla users')
    // await connection.query(`
    //     INSERT INTO users (email, username, password, registrationCode, active, role)
    //       VALUES('user@example.com', 'usuario01', '123123', '001', 1, 'admin'),
    //             ('user2@example.com', 'usuario02', '123123', '001', 1, 'normal'),
    //             ('user3@example.com', 'usuario03', '123123', '001', 1, 'normal'),
    //             ('user4@example.com', 'usuario04', '123123', '001', 1, 'normal');
    // `)
    
  } catch (error) {
    console.error(error)
  } finally {
    if (connection) connection.release()
    process.exit()
  }
}

init()
