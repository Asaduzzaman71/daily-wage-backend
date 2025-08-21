module.exports = (sequelize, DataTypes) => {
  const UserActivity = sequelize.define('UserActivity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User', // Sequelize automatically pluralizes table names
        key: 'id'
      },
      onDelete: 'CASCADE' // Delete activities when user is deleted
    },
    ip_address: {
      type: DataTypes.STRING(45), // IPv6 requires 45 characters
      allowNull: false,
      validate: {
        isIP: true
      }
    },
    os: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null
    },
    browser: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null
    },
    device: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null
    },
    activity: {
      type: DataTypes.ENUM(
        'login',
        'logout',
        'profile_update',
        'password_change',
        'other'
      ),
      allowNull: false,
      defaultValue: 'other'
    }

  }, {
    tableName: 'user_activities',
    timestamps: true,
    paranoid: false, // No soft delete for activity logs
    indexes: [
      {
        fields: ['userId'] // Index for faster user-based queries
      },
      {
        fields: ['createdAt'] // Index for time-based queries
      }
    ]
  });

  // Define associations
  UserActivity.associate = (models) => {
    UserActivity.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE'
    });
  };

  return UserActivity;
};