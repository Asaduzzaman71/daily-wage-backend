module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [6, 100] // minimum 6 characters
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
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
            type: DataTypes.DATE
        }
    }, {
        tableName: 'users',
        paranoid: true, // enable soft deletion
        defaultScope: {
            attributes: { exclude: ['password'] } // exclude password by default
        },
        scopes: {
            withPassword: {
                attributes: { include: ['password'] } // include when needed
            }
        }
    });

    // Define associations
    User.associate = function(models) {
        User.hasOne(models.UserVerify, {
            as: 'userVerify',
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
        
        User.hasMany(models.UserActivity, {
            as: 'userActivities',
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
    };

    return User;
};