'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('rating_personals', 'number', 'score')
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('rating_personals', 'score', 'number')
  }
}
