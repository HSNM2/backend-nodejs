const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Users_Favorite_Associations Model Create ===`)

let UserFavoriteAssociation = db.define('user_favorite_associations', {
  favorite: {
    type: DataTypes.BOOLEAN
  }
})

module.exports = {
  UserFavoriteAssociation
}
