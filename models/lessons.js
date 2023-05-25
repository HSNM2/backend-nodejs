const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Lesson Model Create ===`)

let Lesson = null
Lesson = db.define('lessons', {
  title: {
    allowNull: false,
    type: DataTypes.STRING
  },
  videoPath: {
    type: DataTypes.STRING
  },
  isPublish: {
    type: DataTypes.BOOLEAN
  }
})

module.exports = {
  Lesson
}
