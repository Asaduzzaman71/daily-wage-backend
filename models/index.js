require('dotenv').config();
const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
        port: process.env.DATABASE_PORT,
        host: process.env.DATABASE_HOST,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);
try {
    // connectDB
    sequelize.authenticate()
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.log(error);
  }
const db = {}
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./User')(sequelize, DataTypes)
db.UserActivity = require('./UserActivity')(sequelize, DataTypes)
db.UserVerify = require('./UserVerify')(sequelize, DataTypes)

db.User.hasOne(db.UserVerify, {
  as: 'userVerify',
  foreignKey: 'userId'
});
db.User.hasMany(db.UserActivity, {
  as: 'userActivities',
  foreignKey: 'userId'
});
db.UserVerify.belongsTo(db.User, {
    as: 'user',
    foreignKey: 'userId'
});
db.UserActivity.belongsTo(db.User, {
    as: 'user',
    foreignKey: 'userId'
});
module.exports = db;