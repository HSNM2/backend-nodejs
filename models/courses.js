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

Course.associate = function (models) {
  Course.belongsToMany(models.User, { through: 'users_courses', foreignKey: 'course_id' })
}

Course.sync().then(() => {
  console.log(`Course Model synced`)
})

module.exports = {
  Course
}
