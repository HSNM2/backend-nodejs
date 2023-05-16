const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Class_Faq Model Create ===`)

let ClassFaq = null
ClassFaq = db.define('class_faqs', {
  id: {
    allowNull: false,
    type: DataTypes.STRING,
    primaryKey: true
  },
  title: {
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
  ClassFaq
}
