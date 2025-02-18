const express = require('express');
const router = express.Router();

const { getAllProducts, saveProduct, getProductById, deleteProduct,getCategory, saveCategory, getCategoryById, deleteCategory } = require('./controller');

router.get('/', getAllProducts);
router.get('/:id([0-9]+)', getProductById);
router.post('/', saveProduct);
router.delete('/:id([0-9]+)', deleteProduct);
router.get('/categories', getCategory);
router.post('/categories', saveCategory);
router.get('/categories/:id([0-9]+)', getCategoryById);
router.delete('/categories/:id([0-9]+)', deleteCategory);

module.exports = router;