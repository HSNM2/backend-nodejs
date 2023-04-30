const { Sequelize } = require('sequelize')

let db = null
db = new Sequelize(process.env['DEV_DATABASE_NAME'], process.env['DEV_DATABASE_USERNAME'], null, {
  host: process.env['DEV_DATABASE_HOST'],
  dialect: 'postgres'
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
