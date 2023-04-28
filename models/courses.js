const { db } = require('../config/db')
const { DataTypes } = require('sequelize')

let Course = null
Course = db.define('courses', {
  price: {
    type: DataTypes.INTEGER
  },
  originPrice: {
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.CHAR(255)
  },
  tag: {
    type: DataTypes.CHAR(255)
  },
  image_path: {
    type: DataTypes.CHAR(255)
  },
  link: {
    type: DataTypes.STRING
  },
  subTitle: {
    type: DataTypes.CHAR(255)
  },
  description: {
    type: DataTypes.TEXT
  }
})

Course.sync().then(() => {
  console.log(`Course Model synced`)
})

module.exports = {
  Course
}
