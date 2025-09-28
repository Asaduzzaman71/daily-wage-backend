'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      {
        name: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'moderator',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'contractor',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
