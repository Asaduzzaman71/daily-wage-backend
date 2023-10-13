
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class UserActivity extends Model {
    static associate(models) {
        // define association here
        this.belongsTo(models.User, {
            foreignKey: "userID",
            as: 'user'
        });
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
module.exports = UserActivity ;