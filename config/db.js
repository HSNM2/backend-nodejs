const { Sequelize } = require('sequelize')

// let db = null
// const init = () => {
//   const sequelize = new Sequelize(
//     'postgres', process.env['ROOT_USERNAME'],
//     process.env['ROOT_PASSWORD'] ? process.env['ROOT_USERNAME'] : null,
//     {
//       host: process.env['DEV_DATABASE_HOST'],
//       dialect: 'postgres'
//     }
//   )

//   // 查看名稱為 nodeDB_dev 的 database 是否存在
//   sequelize.query(`SELECT 1 FROM pg_database WHERE datname='${process.env['DEV_DATABASE_NAME']}'`)
//   .then(([results, metadata]) => {
//     if(results.length === 0) {
//       return sequelize.query(`CREATE DATABASE ${process.env['DEV_DATABASE_NAME']}`)
//     }
//   }).then(() => {
//     // 建立 database 連接的 instance
//     db = new Sequelize(
//       process.env['DEV_DATABASE_NAME'], process.env['ROOT_USERNAME'],
//       process.env['ROOT_PASSWORD'] ? process.env['ROOT_USERNAME'] : null,
//       {
//         host: process.env['DEV_DATABASE_HOST'],
//         dialect: 'postgres'
//       }
//     )
//   })
// }

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
  // initDB: init,
  db,
  testDBConnection
}
