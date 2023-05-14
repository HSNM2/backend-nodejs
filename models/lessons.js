const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Lesson Model Create ===`)

let Lesson = null
Lesson = db.define('lessons', {
  id: {
    allowNull: false,
    type: DataTypes.STRING,
    primaryKey: true
  },
  title: {
    allowNull: false,
    type: DataTypes.STRING
  }
})

module.exports = {
  Lesson
}
