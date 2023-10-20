'use strict';
const db = require('../models')
const User = db.User
const { randomNumber } = require('../services/userService')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      
    const user = await User.findOne({ where: { email: 'superadmin@gmail.com' } });
    const token = randomNumber(100000, 999999);

    return queryInterface.bulkInsert('user_verifies', [
      {
        emailVerificationToken: token,
        userId: user.id,
        isEmailVerified: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user_verifies', null, {});
  }
};
