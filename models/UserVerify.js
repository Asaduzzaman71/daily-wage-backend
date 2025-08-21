
module.exports = (sequelize,DataTypes) =>{
const UserVerify = sequelize.define('UserVerify', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User', 
                key: 'id'
            }
        },
        email_verification_token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_email_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        tableName: 'user_verifies',
        paranoid: false, 
    });
    return UserVerify;
}
