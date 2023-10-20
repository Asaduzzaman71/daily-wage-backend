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
        os: {
          defaultValue: false,
          type: Sequelize.TEXT
        },
        browser: {
          defaultValue: false,
          type: Sequelize.TEXT
        },
        device: {
          defaultValue: false,
          type: Sequelize.TEXT
        },
        activity: {
          defaultValue: false,
          type: Sequelize.STRING
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
