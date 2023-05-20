const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Pre_Class_Inquiries_Responses Model Create ===`)

let PreClassInquiryRes = null
PreClassInquiryRes = db.define('pre_class_inquiries_responses', {
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
  PreClassInquiryRes
}
