'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('class_faq_questions', 'title', {
      type: Sequelize.STRING
    })
    await queryInterface.changeColumn('class_faq_questions', 'publish', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('class_faq_questions', 'title')
    await queryInterface.changeColumn('class_faq_questions', 'publish', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: true
    })
  }
}
