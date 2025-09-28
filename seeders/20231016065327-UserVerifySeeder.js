'use strict';
const db = require('../models')
const User = db.User
const { randomNumber } = require('../services/userService')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      
    const user = await User.findOne({ where: { email: 'admin@gmail.com' } });
    const token = randomNumber(100000, 999999);

    return queryInterface.bulkInsert('user_verifies', [
      {
        user_id: user.id,
        email_verification_token: token,
        is_email_verified: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user_verifies', null, {});
  }
};
