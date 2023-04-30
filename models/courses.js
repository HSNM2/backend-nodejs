const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

console.log(`=== Courses Model Create ===`)

let Course = null
Course = db.define('courses', {
  price: {
    type: DataTypes.INTEGER
  },
  originPrice: {
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING
  },
  tag: {
    type: DataTypes.STRING
  },
  image_path: {
    type: DataTypes.TEXT
  },
  link: {
    type: DataTypes.STRING
  },
  subTitle: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  }
})

module.exports = {
  Course
}
