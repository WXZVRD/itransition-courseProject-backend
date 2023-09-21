const { DataTypes } = require('sequelize');
const sequelize = require('../../database');

const User = sequelize.define('users', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    secondName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    githubId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true
    }
},
    {
        timestamps: false,
        freezeTableName: true
    });

module.exports = User;
