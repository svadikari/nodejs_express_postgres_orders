const { DataTypes, Model } = require('sequelize');
const db = require('../../db');

class User extends Model {}
User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'user'
});

class RefreshToken extends Model { }
RefreshToken.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'refreshToken'
});

module.exports = { User, RefreshToken };
