'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get the IDs of the roles from the existing database
    const userRole = await queryInterface.rawSelect('Roles', { where: { name: 'user' } }, ['id']);
    const adminRole = await queryInterface.rawSelect('Roles', { where: { name: 'admin' } }, ['id']);

    if (!adminRole) {
      throw new Error("Admin role not found. Please run the role seeder first.");
    }
    
    // Insert the user and get the ID of the newly created user.
    // We are assuming 'name' in your seeder corresponds to 'username' in the model.
    const userId = await queryInterface.bulkInsert('users', [
      {
        role_id: adminRole,
        name: 'admin',
        email: 'admin-1@gmail.com',
        phone: '01756527233',
        password: await bcrypt.hash('12345678', 10),
        profile_pic: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
    if (!userId) {
      throw new Error("user not found. Please create user first.");
    }
   
  },

  down: async (queryInterface, Sequelize) => {
    // Then delete the user
    await queryInterface.bulkDelete('users', null, {});
  },
};
