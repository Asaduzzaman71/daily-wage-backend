'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable('user_activities', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        userId: {
          type: Sequelize.DataTypes.INTEGER,
          references: {
            model: {
              tableName: 'users',
            },
            key: 'id'
          },
          allowNull: false
        },
        ipAddress: {
          allowNull: false,
          type: Sequelize.STRING
        },
        userAgent: {
          defaultValue: false,
          type: Sequelize.TEXT
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_activities');
  }
};
