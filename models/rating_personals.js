const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Rating_Personals Model Create ===`)

let RatingPersonal = null
RatingPersonal = db.define('rating_personals', {
  id: {
    allowNull: false,
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  number: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  date: {
    allowNull: false,
    type: DataTypes.DATE
  },
  content: {
    type: DataTypes.STRING
  }
})

module.exports = {
  RatingPersonal
}
