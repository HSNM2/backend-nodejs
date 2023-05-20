const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Pre_Class_Inquiries Model Create ===`)

let PreClassInquiry = null
PreClassInquiry = db.define('pre_class_inquiries', {
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  content: {
    allowNull: false,
    type: DataTypes.STRING
  }
})

module.exports = {
  PreClassInquiry
}
