const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Users_Favorites Model Create ===`)

let UserFavorite = db.define('user_favorites', {
  favorite: {
    type: DataTypes.STRING
  }
})

module.exports = {
  UserFavorite
}
