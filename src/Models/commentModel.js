const sequelize = require('../../database')
const { DataTypes } = require('sequelize')

const User = require('./userModel')

const Comment = sequelize.define('comments', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    reviewId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    author: {
        type: DataTypes.UUID,
        ref: {
            model: User,
            key: 'id'
        }
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    freezeTableName: true
})

Comment.belongsTo(User, { foreignKey: 'author' })

module.exports = Comment