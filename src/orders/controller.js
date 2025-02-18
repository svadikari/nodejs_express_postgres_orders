const { Order } = require('./models');
const { orderSchema, updateOrderSchema } = require('./schemas');


const saveOrder = async (req, res) => {
    try {
        const { error } = orderSchema.validate(req.body, { abortEarly: false })
        if (error) {
            return res.status(400).json({ errors: error.details.map(e => e.message) });
        };
        req.body.total = req.body.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await Order.create(req.body, { include: 'orderItems', validate: false }).then(order => {
            return res.status(201).json(order);
        }).catch(err => {
            return res.status(400).json({ error: err.message });
        });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({ include: 'orderItems' });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, { include: 'orderItems' });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const { error } = updateOrderSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map(e => e.message) });
        };
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        await order.update(req.body);
        res.status(200).json(order);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        await order.destroy();
        res.json({ message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    saveOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
};