const { DataTypes } = require('sequelize');
const sequelize = require('../../database');

const Rating = sequelize.define('ratings', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    productId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    reviewerId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reviewerRate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
        validate: {
            min: 0,
            max: 10
        }
    },
},
    {
        timestamps: false,
        freezeTableName: true
    });

module.exports = Rating;
