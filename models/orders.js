const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Order Model Create ===`)

let Order = null
Order = db.define('orders', {
  email: {
    allowNull: false,
    type: DataTypes.STRING
  },
  amt: {
    allowNull: false,
    type: DataTypes.STRING
  },
  merchantOrderNo: {
    allowNull: false,
    type: DataTypes.STRING
  },
  isPurchased: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
})

module.exports = {
  Order
}
