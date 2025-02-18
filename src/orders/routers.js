const express = require('express');
const router = express.Router();
const { getAllOrders,saveOrder, getOrderById, updateOrder, deleteOrder } = require('./controller');

router.post('/', saveOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;
