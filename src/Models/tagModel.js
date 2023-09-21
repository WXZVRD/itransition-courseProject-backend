const { DataTypes } = require('sequelize');
const sequelize = require('../../database')

const Tag = sequelize.define('tags', {
        title: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
    },
    {
        timestamps: false,
        freezeTableName: true
    })

module.exports = Tag