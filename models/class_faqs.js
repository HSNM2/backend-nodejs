const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Class_Faq Model Create ===`)

let ClassFaq = null
ClassFaq = db.define('class_faqs', {
  title: {
    allowNull: false,
    type: DataTypes.STRING
  }
})

module.exports = {
  ClassFaq
}
