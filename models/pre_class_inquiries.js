const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Pre_Class_Inquiries Model Create ===`)

let PreClassInquiry = null
PreClassInquiry = db.define('pre_class_inquiries', {
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
  PreClassInquiry
}
