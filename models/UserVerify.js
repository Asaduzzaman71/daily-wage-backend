
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');
// const User = require('./User')
module.exports = (sequelize,DataTypes) =>{
const UserVerify = sequelize.define('UserVerify', {
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
        emailVerificationToken: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isEmailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        tableName: 'user_verifies'
    });
    return UserVerify;
}
// UserVerify.belongsTo(User, {
//     as: 'user'
// });
// module.exports = UserVerify ;