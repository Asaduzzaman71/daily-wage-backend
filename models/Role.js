
module.exports = (sequelize,DataTypes) =>{
const Role = sequelize.define('Role', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING(50),
            references: {
                model: 'User', 
                key: 'id'
            }
        }
    }, {
        tableName: 'roles',
        timestamps: true,
        paranoid: false, 
    });
    return Role;
}
