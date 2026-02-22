// models/Message.js
module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        conversation_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'conversations',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('sent', 'delivered', 'read'),
            defaultValue: 'sent'
        },
        read_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        tableName: 'messages',
        paranoid: false
    });

    Message.associate = function(models) {
        Message.belongsTo(models.Conversation, {
            as: 'conversation',
            foreignKey: 'conversation_id'
        });
        Message.belongsTo(models.User, {
            as: 'sender',
            foreignKey: 'sender_id'
        });
    };

    return Message;
};
