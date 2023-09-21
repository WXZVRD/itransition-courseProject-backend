const { DataTypes } = require('sequelize');
const sequelize = require('../../database');
const User = require('./userModel');
const Product = require('./productModel')

const Review = sequelize.define('reviews', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
    },
    productId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Product,
            key: 'id'
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
    },
    grade: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    likes: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        defaultValue: [],
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
}, {
    timestamps: true,
    freezeTableName: true,
});



Review.belongsTo(User, { foreignKey: 'author' });
Review.belongsTo(Product, { foreignKey: 'productId' })

module.exports = Review;
