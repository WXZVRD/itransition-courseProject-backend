const sequelize = require('../../database')
const { DataTypes } = require('sequelize')

const Product = sequelize.define('products', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    averageRating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
        validate: {
            min: 0,
            max: 10
        }
    }
},
    {
        freezeTableName: true,
        timestamps: false,
        underscored: false
    })


module.exports = Product
