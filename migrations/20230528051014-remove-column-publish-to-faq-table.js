'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('class_faqs', 'publish')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('class_faqs', 'publish', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: true
    })
  }
}
