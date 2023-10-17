
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
class UserVerify extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
        this.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    }
}
UserVerify.init({
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
    sequelize,
    modelName: 'UserVerify',
    tableName: 'user_verifies'
});
module.exports = UserVerify ;