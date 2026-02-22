// models/Conversation.js
module.exports = (sequelize, DataTypes) => {
    const Conversation = sequelize.define('Conversation', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING, // optional: group name
            allowNull: true
        },
        is_group: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
        tableName: 'conversations',
        paranoid: false
    });

    Conversation.associate = function(models) {
        Conversation.hasMany(models.ConversationParticipant, {
            as: 'participants',
            foreignKey: 'conversation_id',
            onDelete: 'CASCADE'
        });
        Conversation.hasMany(models.Message, {
            as: 'messages',
            foreignKey: 'conversation_id',
            onDelete: 'CASCADE'
        });
    };

    return Conversation;
};

