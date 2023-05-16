const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Class_Faq_Questions Model Create ===`)

let ClassFaqQuestion = null
ClassFaqQuestion = db.define('class_faq_questions', {
  id: {
    allowNull: false,
    type: DataTypes.STRING,
    primaryKey: true
  },
  content: {
    allowNull: false,
    type: DataTypes.STRING
  },
  publish: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
})

module.exports = {
  ClassFaqQuestion
}
