// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
// const User = require('./User')
module.exports = (sequelize,DataTypes) =>{
const UserActivity = sequelize.define('UserActivity', {
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
        os: {
            type: DataTypes.STRING,
            defaultValue: false,
        },
        browser: {
            type: DataTypes.STRING,
            defaultValue: false,
        },
        device: {
            type: DataTypes.STRING,
            defaultValue: false,
        },
        activity: {
            type: DataTypes.STRING,
            defaultValue: false,
        },
    },{
        tableName: 'user_activities'
    });
    return UserActivity;
}

// UserActivity.belongsTo(User, {
//     as: 'user'
// });
// module.exports = UserActivity ;