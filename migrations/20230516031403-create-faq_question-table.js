'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('class_faq_questions', {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      content: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      publish: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      faqId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'class_faqs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
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
    await queryInterface.dropTable('class_faq_questions')
  }
}
