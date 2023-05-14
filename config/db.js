const { Sequelize } = require('sequelize')
const env = process.env.BACKEND_NODE_ENV || 'development'
const config = require(__dirname + '/../config/config.json')[env]

let db = null
db = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
})

const testDBConnection = async () => {
  try {
    await db.authenticate()
    console.log(`Connect has been established successfully.`)
  } catch (error) {
    console.error(`Unable to connect to the database: `, error)
  }
}

module.exports = {
  db,
  testDBConnection
}
