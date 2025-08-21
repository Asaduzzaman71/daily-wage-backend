require('dotenv').config();
const Sequelize = require("sequelize");

const sequlize = new Sequelize(
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
        },
        define: {
            timestamps: true,
            paranoid: true, // enables soft deletion
            underscored: true // uses snake_case for column names
        }
    }
);
module.exports = sequlize