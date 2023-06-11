'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('courses', {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      price: {
        type: Sequelize.INTEGER
      },
      originPrice: {
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      tag: {
        type: Sequelize.STRING
      },
      image_path: {
        type: Sequelize.TEXT
      },
      link: {
        type: Sequelize.STRING
      },
      subTitle: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      courseStatus: {
        type: Sequelize.STRING
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      provider: {
        allowNull: false,
        type: Sequelize.STRING
      },
      buyers: {
        type: Sequelize.INTEGER
      },
      totalTime: {
        type: Sequelize.FLOAT
      },
      isPublish: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        autoIncrement: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('courses')
  }
}
