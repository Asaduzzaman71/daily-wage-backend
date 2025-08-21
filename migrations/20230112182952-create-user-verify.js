'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_verifies', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        user_id: {
          type: Sequelize.DataTypes.INTEGER,
          references: {
            model: {
              tableName: 'users',
            },
            key: 'id'
          },
          allowNull: false
        },
        email_verification_token: {
          allowNull: false,
          type: Sequelize.STRING
        },
        is_email_verified: {
          defaultValue: false,
          type: Sequelize.BOOLEAN
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        }
    });
    
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_verifies');
  }
};