
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
// const UserVerify = require('./UserVerify');
// const UserActivity = require('./UserActivity');
module.exports = (sequelize,DataTypes) =>{
  const User = sequelize.define('User', {
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
    phone: {
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
  });
  return User
}

// User.hasOne(UserVerify, {
//   as: 'userVerify'
// });
// User.hasMany(UserActivity, {
//   as: 'userActivities'
// });
// module.exports = User;