const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(process.env.POSTGRES_DB, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

module.exports = sequelize;
