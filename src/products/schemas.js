const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),
    description: Joi.string()
        .min(3)
        .max(100)
        .required(),
    price: Joi.number()
        .precision(2).
        required(),
    categoryId: Joi.number().integer()
        .min(1)
        .required(),
    stock: Joi.number().integer()
        .min(1)
        .required(),
});

const categorySchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .valid('Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Beauty & Personal Care', 'Toys', 'Sports & Outdoors', 'Automotive', 'Health', 'Baby', 'Other')
        .required()
});

module.exports = { productSchema , categorySchema };