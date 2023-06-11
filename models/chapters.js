const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Chapter Model Create ===`)

let Chapter = null
Chapter = db.define('chapters', {
  title: {
    allowNull: false,
    type: DataTypes.STRING
  }
})

module.exports = {
  Chapter
}
