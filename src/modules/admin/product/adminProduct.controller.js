// src/modules/products/product.controller.js
import * as productService from './adminProduct.service.js';

// Controller to get all products (Public Access)
export const getAllProducts = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        const products = await productService.getAllProducts(skip, limit, search, page);

        res.status(200).json({
            code: 200,
            data: products.data,
            pagination: products.pagination,
        });

    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

// Controller to get a single product by ID (Public Access)
export const getProductById = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);

        const product = await productService.getProductById(productId);

        res.status(200).json({
            code: 200,
            data: product.data,
        });

    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

// Controller to create a new product (Admin Only)
export const createProduct = async (req, res) => {
    try {
        const adminId = req.user.id; // From auth middleware
        const { name, description, categoryId } = req.body;

        if (!name  || !categoryId || !description) {
            return res.status(400).json({
                code: 400,
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
            return res.status(500).json({code: 500, code: 500, message: newProduct.message });
        }

        res.status(200).json({
            code: 200,
            message: 'Product created successfully',
            data: newProduct.data,
        });

    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

// Controller to update a product (Admin Only)
export const updateProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        // GET ADMIN ID FROM AUTH MIDDLEWARE
        const adminId = req.user.id;
        const productDataPayload = req.body;
        if (productDataPayload.createdAt) delete productDataPayload.createdAt; // Prevent owner change

        // 🔥 Ambil path file yang di-upload
        let imageUrl = null;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`; // Path lokal
        }
        
        const productData = {
            name : productDataPayload.name,
            description: productDataPayload.description,
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: parseInt(productDataPayload.categoryId),
            created_by: adminId,
            updated_by: adminId,
        };

        // DETERMINE IMAGE URL
        if (imageUrl) {
            productData.imageUrl = imageUrl;
        }

        const updatedProduct = await productService.updateProductById(productId, productData);

        if(updatedProduct.status === false) {
            return res.status(500).json({code: 500, message: updatedProduct.message });
        }

        res.status(200).json({
            code: 200,
            message: 'Product updated successfully',
            data: updatedProduct,
        });

    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

// Controller to delete a product (Admin Only)
export const deleteProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        await productService.deleteProductById(productId);
        res.status(200).json({
            code: 200,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

export const createProductVariant = async (req, res) => {
    try {
        const adminId = req.user.id; // From auth middleware
        const {name, productId, sku, price, stock } = req.body;

        if (!productId || !name || price === undefined || stock === undefined || !sku) {
            return res.status(400).json({
                code: 500,
                message: 'Fields productId, name, price, stock, and sku are required.',
            });
        }

        // Ambil path file yang di-upload
        let imageUrl = null;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`; // Path lokal
        }

        const variantData = {
            productId: Number(productId),
            name,
            sku,
            price: parseFloat(price),
            stock: Number(stock),
            imageUrl,
            createdAt: new Date(),
            created_by: adminId,
            updatedAt: new Date(),
            updated_by: adminId,
        };

        const newVariant = await productService.createProductVariant(productId, variantData);

        if(newVariant.status === false) {
            return res.status(500).json({code: 500, message: newVariant.message });
        }

        res.status(200).json({
            code: 200,
            message: 'Variant created successfully',
            data: newVariant,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ code: 500, message: error.message });
    }
}

export const getAllVariants = async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);

        const variants = await productService.getProductVariantsList(productId);

        if(variants.status === false) {
            return res.status(500).json({code: 500, message: variants.message });
        }

        res.status(200).json({
            code: 200,
            message: 'All Oke',
            data: variants.data,
        });

    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
};

export const getProductVariantDetail = async (req, res) => {
    try {
        const variantId = parseInt(req.params.id);

        const variant = await productService.getProductVariantsDetail(variantId);

        res.status(200).json({
            code: 200,
            data: variant,
        });

    } catch (error) {
        console.log(error.message);
        
        res.status(500).json({ code: 500, message: error.message });
    }
}

export const updateProductVariant = async (req, res) => {
    try {
        const adminId = req.user.id; // From auth middleware
        const { name, productId, sku, price, stock } = req.body;

        const variantId = parseInt(req.params.id);
        console.log(variantId, "variantId");
        if (!productId || !name || price === undefined || stock === undefined || !sku, !variantId) {
            return res.status(400).json({
                code: 500,
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
            price: parseFloat(price),
            stock: Number(stock),
            imageUrl,
            updatedAt: new Date(),
            updated_by: adminId,
        };

        const updatedVariant = await productService.updateProductVariant(variantId, variantData);

        if(updatedVariant.status === false) {
            return res.status(500).json({code: 500, message: updatedVariant.message });
        }

        res.status(200).json({
            code: 200,
            message: 'Variant updated successfully',
            data: updatedVariant.data,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ code: 500, message: error.message });
    }
};

export const deleteProductVariant = async (req, res) => {
    try {

        const variantId = parseInt(req.params.id);

        await productService.deleteProductVariant(variantId);

        if(productService.status === false) {
            return res.status(500).json({code: 500, message: productService.message });
        }

        res.status(200).json({
            code: 200,
            message: 'Variant deleted successfully',
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ code: 500, message: error.message });
    }
};

export const getProductCategory = async (req, res) => {
    try {
        const categories = await productService.getProductCategory();

        if(categories.status === false) {
            return res.status(500).json({code: 500, message: categories.message });
        }

        res.status(200).json({
            code: 200,
            data: categories.data,
            message: 'Categories found successfully'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ code: 500, message: error.message });
    }
}

export const getTotalProduct = async (req, res) => {
    try {
        const totalProduct = await productService.getTotalProduct();

        if(totalProduct.status === false) {
            return res.status(500).json({code: 500, message: totalProduct.message });
        }

        res.status(200).json({
            code: 200,
            data: totalProduct.data,
            message: 'Total product found successfully'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ code: 500, message: error.message });
    }
};

export const getTotalProductVariant = async (req, res) =>  {
    try {
        const totalProductVariant = await productService.getTotalProductVariant();
        
        if(totalProductVariant.status === false) {
            return res.status(500).json({code: 500, message: totalProductVariant.message });
        }

        res.status(200).json({
            code: 200,
            data: totalProductVariant.data,
            message: 'Total product variant found successfully'
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({ code: 500, message: error.message });
    }
}