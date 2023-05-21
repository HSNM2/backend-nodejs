'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('pre_class_inquiries_responses', 'date', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    })
    await queryInterface.changeColumn('pre_class_inquiries', 'date', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    })
    await queryInterface.changeColumn('rating_personals', 'date', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('rating_personals', 'date', {
      type: Sequelize.DATE,
      allowNull: false
    })
    await queryInterface.changeColumn('pre_class_inquiries', 'date', {
      type: Sequelize.DATE,
      allowNull: false
    })
    await queryInterface.changeColumn('pre_class_inquiries_responses', 'date', {
      type: Sequelize.DATE,
      allowNull: false
    })
  }
}
