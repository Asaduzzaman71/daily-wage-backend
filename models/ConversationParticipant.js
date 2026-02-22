// models/ConversationParticipant.js
module.exports = (sequelize, DataTypes) => {
    const ConversationParticipant = sequelize.define('ConversationParticipant', {
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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        role: {
            type: DataTypes.STRING, // optional: 'admin' or 'member'
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
        tableName: 'conversation_participants',
        paranoid: false, 
        
    });

    ConversationParticipant.associate = function(models) {
        ConversationParticipant.belongsTo(models.Conversation, {
            as: 'conversation',
            foreignKey: 'conversation_id'
        });
        ConversationParticipant.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'user_id'
        });
    };

    return ConversationParticipant;
};
