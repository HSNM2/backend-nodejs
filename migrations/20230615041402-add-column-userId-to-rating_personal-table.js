'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('rating_personals', 'userId', {
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
    await queryInterface.removeColumn('rating_personals', 'userId')
  }
}
