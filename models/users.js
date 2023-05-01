const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Users Model Create ===`)

let User = null
User = db.define('users', {
  hashId: {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING
  },
  nickName: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  gender: {
    type: DataTypes.CHAR(1)
  },
  birthday: {
    type: DataTypes.DATE
  },
  phone: {
    type: DataTypes.CHAR(10),
    charset: 'utf8mb4'
  },
  email: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  }
})

module.exports = {
  User
}
