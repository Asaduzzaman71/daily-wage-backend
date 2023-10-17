
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class User extends Model {
  static associate(models) {
    // define association here
    this.hasMany(models.UserActivity);
    this.hasOne(models.UserVerify);
  }
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
}, {
  sequelize,
  modelName: 'User',
});
module.exports = User;