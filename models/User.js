
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const UserVerify = require('./UserVerify');
const { randomNumber } = require('../services/userService')
class User extends Model {

}
User.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM("admin", "user"),
    allowNull: false,
    defaultValue: 'user',
  },
  profilePic: {
    type: DataTypes.STRING,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: 'User',
});
User.hasOne(UserVerify, {
      foreignKey: 'userId',
      as: 'userVerify'
    })
module.exports = User;