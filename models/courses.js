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
  title: {
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
  },
  courseStatus: {
    type: DataTypes.STRING
  },
  type: {
    allowNull: false,
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING
  },
  provider: {
    allowNull: false,
    type: DataTypes.STRING
  },
  buyers: {
    type: DataTypes.INTEGER
  },
  totalTime: {
    type: DataTypes.FLOAT
  },
  isPublish: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
})

module.exports = {
  Course
}
