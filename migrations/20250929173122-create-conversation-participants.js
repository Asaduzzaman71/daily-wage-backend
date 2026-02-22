'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('conversation_participants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      conversation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'conversations',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      role: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add unique constraint to prevent duplicate participants
    await queryInterface.addConstraint('conversation_participants', {
      fields: ['conversation_id', 'user_id'],
      type: 'unique',
      name: 'unique_conversation_participant'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('conversation_participants');
  }
};
