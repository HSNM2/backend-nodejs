'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      amt: {
        allowNull: false,
        type: Sequelize.STRING
      },
      merchantOrderNo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isPurchased: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      paymentType: {
        type: Sequelize.STRING
      },
      payTime: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('orders')
  }
}
