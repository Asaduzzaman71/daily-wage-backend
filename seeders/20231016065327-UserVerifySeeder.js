'use strict';
const User = require("../models/User");
const {randomNumber} = require('../services/userService')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      
    const user = await User.findOne({
      where: { email: 'superadmin@gmail.com' },
    });
    const token = randomNumber(100000, 999999);

    return queryInterface.bulkInsert('Users', [
      {
        userId: user.id,
        emailVerficationToken: token,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
