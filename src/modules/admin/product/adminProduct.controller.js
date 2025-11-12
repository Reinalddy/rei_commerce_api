// src/modules/products/product.controller.js
import * as productService from './adminProduct.service.js';

// Controller to get all products (Public Access)
export const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();

        res.status(200).json({
            code: 200,
            status: 'success',
            data: products.data,
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
            data: product.data,
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
        const adminId = req.user.id; // From auth middleware
        const { name, description, price, stock, categoryId } = req.body;

        if (!name || price === undefined || stock === undefined || !categoryId) {
            return res.status(400).json({
                status: 'error',
                message: 'Fields name, price, stock, and categoryId are required.',
            });
        }

        // 🔥 Ambil path file yang di-upload
        let imageUrl = null;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`; // Path lokal
        }

        const productData = {
            name,
            description,
            imageUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: parseInt(categoryId),
            created_by: adminId,
            updated_by: adminId,
        };

        const newProduct = await productService.createProduct(productData);

        if(newProduct.status === false) {
            return res.status(500).json({ status: 'error', message: newProduct.message });
        }
        res.status(200).json({
            status: 'success',
            message: 'Product created successfully',
            data: newProduct.data,
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Controller to update a product (Admin Only)
export const updateProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const productDataPayload = req.body;
        if (productDataPayload.ownerId) delete productDataPayload.ownerId; // Prevent owner change

        const productData = {
            name,
            description,
            imageUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: parseInt(categoryId),
            created_by: adminId,
            updated_by: adminId,
        };

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

export const createProductVariant = async (req, res) => {
    try {
        const adminId = req.user.id; // From auth middleware
        const {name, productId, sku, price, stock } = req.body;

        if (!productId || !name || price === undefined || stock === undefined || !sku) {
            return res.status(400).json({
                status: 'error',
                message: 'Fields productId, name, price, stock, and sku are required.',
            });
        }

        // 🔥 Ambil path file yang di-upload
        let imageUrl = null;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`; // Path lokal
        }

        const variantData = {
            productId: parseInt(productId),
            name,
            sku,
            price,
            stock,
            imageUrl,
            createdAt: new Date(),
            created_by: adminId,
            updatedAt: new Date(),
            updated_by: adminId,
        };

        const newVariant = await productService.createProductVariant(productId, variantData);

        res.status(200).json({
            status: 'success',
            message: 'Variant created successfully',
            data: newVariant,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
}

export const getAllVariants = async (req, res) => {
    try {
        const variants = await productService.getProductVariantsList();

        res.status(200).json({
            status: 'success',
            data: variants,
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const getProductVariantDetail = async (req, res) => {
    try {
        const variantId = parseInt(req.params.id);

        const variant = await productService.getProductVariantsDetail(variantId);

        res.status(200).json({
            status: 'success',
            data: variant,
        });

    } catch (error) {
        console.log(error.message);
        
        res.status(500).json({ status: 'error', message: error.message });
    }
}

export const updateProductVariant = async (req, res) => {
    try {
        const adminId = req.user.id; // From auth middleware
        const { name, productId, sku, price, stock } = req.body;

        const variantId = parseInt(req.params.id);

        if (!productId || !name || price === undefined || stock === undefined || !sku, !variantId) {
            return res.status(400).json({
                status: 'error',
                message: 'Fields productId, name, price, stock, and sku are required.',
            });
        }

        // 🔥 Ambil path file yang di-upload
        let imageUrl = null;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`; // Path lokal
        }

        const variantData = {
            productId: parseInt(productId),
            name,
            sku,
            price,
            stock,
            imageUrl,
            updatedAt: new Date(),
            updated_by: adminId,
        };

        const updatedVariant = await productService.updateProductVariant(variantId, variantData);

        res.status(200).json({
            status: 'success',
            message: 'Variant updated successfully',
            data: updatedVariant,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const deleteProductVariant = async (req, res) => {
    try {

        const variantId = parseInt(req.params.id);

        await productService.deleteProductVariant(variantId);

        res.status(200).json({
            status: 'success',
            message: 'Variant deleted successfully',
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};