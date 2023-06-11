const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Rating_Personals Model Create ===`)

let RatingPersonal = null
RatingPersonal = db.define('rating_personals', {
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  number: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  content: {
    type: DataTypes.STRING
  }
})

module.exports = {
  RatingPersonal
}
