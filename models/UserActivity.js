
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User')

class UserActivity extends Model {
    static associate(models) {
        
    }
}
UserActivity.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'User', 
            key: 'id'
        }
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userAgent: {
        type: DataTypes.TEXT,
        defaultValue: false
    },
}, {
    sequelize,
    modelName: 'UserActivity',
    tableName: 'user_activities'
});
UserActivity.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  })
module.exports = UserActivity ;