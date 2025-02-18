const { DataTypes, Model } = require('sequelize');
const db = require('../../db');
const { User } = require('../users/models');
const { Product } = require('../products/models');

class Order extends Model {}
Order.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    shippingAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shippingCity: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shippingState: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shippingZip: {
        type: DataTypes.STRING,
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    }
}, {
    sequelize: db,
    modelName: 'order'
});

class OrderItem extends Model {}
OrderItem.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'orderItem'
});


Order.belongsTo(User);
User.hasMany(Order);
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

module.exports = { Order, OrderItem };