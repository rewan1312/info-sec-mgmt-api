const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/', authMiddleware, async (req, res) => {
    try {
        const { pname, description, price, stock } = req.body;

        if (!pname || !price || stock === undefined) {
            return res.status(400).json({ message: '❌ Product name, price, and stock are required' });
        }

        const newProduct = new Product({ pname, description, price, stock });
        await newProduct.save();

        res.status(201).json({ message: '✅ Product added successfully', product: newProduct });
    } catch (error) {
        console.error('❌ Error adding product:', error);
        res.status(500).json({ message: '❌ Failed to add product', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        res.status(500).json({ message: '❌ Failed to fetch products', error: error.message });
    }
});


router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await Product.findById(pid);

        if (!product) {
            return res.status(404).json({ message: '❌ Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('❌ Error fetching product:', error);
        res.status(500).json({ message: '❌ Failed to fetch product', error: error.message });
    }
});


router.put('/:pid', authMiddleware, async (req, res) => {
    try {
        const { pid } = req.params;
        const { pname, description, price, stock } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(pid, { pname, description, price, stock }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: '❌ Product not found' });
        }

        res.json({ message: '✅ Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error('❌ Error updating product:', error);
        res.status(500).json({ message: '❌ Failed to update product', error: error.message });
    }
});


router.delete('/:pid', authMiddleware, async (req, res) => {
    try {
        const { pid } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(pid);
        if (!deletedProduct) {
            return res.status(404).json({ message: '❌ Product not found' });
        }

        res.json({ message: '✅ Product deleted successfully' });
    } catch (error) {
        console.error('❌ Error deleting product:', error);
        res.status(500).json({ message: '❌ Failed to delete product', error: error.message });
    }
});

module.exports = router;
