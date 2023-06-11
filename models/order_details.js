const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Order Detail Model Create ===`)

let OrderDetail = null
OrderDetail = db.define('order_details', {
  courseId: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  originalPrice: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
})

module.exports = {
  OrderDetail
}
