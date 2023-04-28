const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

let User = null
User = db.define('user', {
  name: {
    type: DataTypes.STRING
  },
  nickName: {
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
    type: DataTypes.CHAR(30)
  },
  address: {
    type: DataTypes.TEXT
  }
})

User.sync().then(() => {
  console.log(`User Model synced`)
})

module.exports = {
  User
}
