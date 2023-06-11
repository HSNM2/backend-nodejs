const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Rating_Summarys Model Create ===`)

let RatingSummary = null
RatingSummary = db.define('rating_summarys', {
  avgRating: {
    type: DataTypes.INTEGER
  },
  countRating: {
    type: DataTypes.INTEGER
  }
})

module.exports = {
  RatingSummary
}
