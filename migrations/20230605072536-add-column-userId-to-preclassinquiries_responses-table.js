'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('pre_class_inquiries_responses', 'userId', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('pre_class_inquiries_responses', 'userId')
  }
}
