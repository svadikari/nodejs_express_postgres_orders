const { Product, Category } = require('./models');
const { productSchema, categorySchema } = require('./schemas');


const saveProduct = async (req, res) => {
    try {
        const { error } = productSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map(e => e.message) });
        }
        await Product.findOne({ where: { name: req.body.name } }).then(product => {
            if (product) {
                return res.status(400).json({ error: 'Product already exists!' });
            } else {
                Product.create(req.body).then(product => {
                    res.json(product);
                }).catch(err => {
                    return res.status(500).json({ error: err.message });
                });
            }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        res.json(await Product.findAll());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, { include: Category });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        await product.destroy();
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getCategory = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const saveCategory = async (req, res) => {
    try {
        const { error } = categorySchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ errors: error.details.map(e => e.message) });
        }
        await Category.findOne({ where: { name: req.body.name } }).then(category => {
            if (category) {
                return res.status(400).json({ error: 'Category already exists!' });
            } else {
                Category.create(req.body).then(category => {
                    res.json(category);
                }).catch(err => {
                    return res.status(500).json({ error: err.message });
                });
            }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        await category.destroy();
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    saveProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
    getCategory,
    saveCategory,
    getCategoryById,
    deleteCategory,

};