require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database')


// Test the database connection
// (async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('Database connection established successfully.');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//         process.exit(1);
//     }
// })();

const db = {
    sequelize,
    Sequelize
};

// Dynamically load all model files
fs.readdirSync(__dirname)
    .filter(file => {
        return (
            file !== 'index.js' && // skip this file
            file.endsWith('.js') && // only JS files
            !file.includes('.test.js') // skip test files
        );
    })
    .forEach(file => {
        const modelPath = path.join(__dirname, file);
        const model = require(modelPath)(sequelize, DataTypes);
        db[model.name] = model;
    });

// Set up model associations
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;