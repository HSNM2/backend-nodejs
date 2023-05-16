const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Pre_Class_Inquiries_Responses Model Create ===`)

let PreClassInquiryRes = null
PreClassInquiryRes = db.define('pre_class_inquiries_responses', {
  id: {
    allowNull: false,
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  date: {
    allowNull: false,
    type: DataTypes.DATEONLY
  },
  content: {
    allowNull: false,
    type: DataTypes.STRING
  }
})

module.exports = {
  PreClassInquiryRes
}
