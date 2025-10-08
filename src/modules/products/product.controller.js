// src/modules/products/product.controller.js
import * as productService from './product.service.js';

// Controller to get all products (Public Access)
export const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json({
            status: 'success',
            data: products,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Controller to get a single product by ID (Public Access)
export const getProductById = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = await productService.getProductById(productId);
        res.status(200).json({
            status: 'success',
            data: product,
        });
    } catch (error) {
        if (error.message === 'Product not found') {
            return res.status(404).json({ status: 'error', message: error.message });
        }
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Controller to create a new product (Admin Only)
export const createProduct = async (req, res) => {
    try {
        const ownerId = req.user.id; // From auth middleware
        const { name, description, price, stock, imageUrl, categoryId } = req.body;

        if (!name || price === undefined || stock === undefined || !categoryId) {
            return res.status(400).json({
                status: 'error',
                message: 'Fields name, price, stock, and categoryId are required.',
            });
        }

        const productData = {
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            imageUrl,
            categoryId: parseInt(categoryId),
            ownerId,
        };

        const newProduct = await productService.createProduct(productData);
        res.status(201).json({
            status: 'success',
            message: 'Product created successfully',
            data: newProduct,
        });
    } catch (error) {
        if (error.code === 'P2003') { // Prisma error for foreign key constraint failed
            return res.status(400).json({ status: 'error', message: 'Invalid categoryId. Category does not exist.' });
        }
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Controller to update a product (Admin Only)
export const updateProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const productData = req.body;
        if (productData.ownerId) delete productData.ownerId; // Prevent owner change

        const updatedProduct = await productService.updateProductById(productId, productData);
        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            data: updatedProduct,
        });
    } catch (error) {
        if (error.message === 'Product not found') {
            return res.status(404).json({ status: 'error', message: error.message });
        }
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Controller to delete a product (Admin Only)
export const deleteProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        await productService.deleteProductById(productId);
        res.status(200).json({
            status: 'success',
            message: 'Product deleted successfully',
        });
    } catch (error) {
        if (error.message === 'Product not found') {
            return res.status(404).json({ status: 'error', message: error.message });
        }
        res.status(500).json({ status: 'error', message: error.message });
    }
};