const Joi = require('joi');

const orderSchema = Joi.object({
    shippingAddress: Joi.string()
        .min(3)
        .max(30)
        .required(),
    shippingCity: Joi.string()
        .min(2)
        .max(30)
        .required(),
    shippingState: Joi.string()
        .min(2)
        .max(30).required(),
    shippingZip: Joi.string().min(2)
        .max(30).required(),
    orderDate: Joi.date().default(Date.now),
    status: Joi.string().valid('pending', 'shipped', 'delivered').default('pending'),
    userId: Joi.number().integer().required(),
    orderItems: Joi.array().items(Joi.object({
        quantity: Joi.number().integer().min(1).required(),
        productId: Joi.number().integer().required(),
        price: Joi.number().precision(2).required()
    }))
        .min(1)
        .required()
});

const updateOrderSchema = Joi.object({
    shippingAddress: Joi.string()
        .min(3)
        .max(30),
    shippingCity: Joi.string()
        .min(2)
        .max(30),
    shippingState: Joi.string()
        .min(2)
        .max(30),
    shippingZip: Joi.string().min(2)
        .min(2)
        .max(30),
    status: Joi.string().valid('pending', 'shipped', 'delivered'),
}).or('shippingAddress', 'shippingCity', 'shippingState', 'shippingZip', 'status').required();

module.exports = {
    orderSchema,
    updateOrderSchema
};