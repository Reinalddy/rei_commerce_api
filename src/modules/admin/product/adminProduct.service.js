// src/modules/products/product.service.js
import prisma from "../../../config/db.js";

/**
 * Get all products from the database with their relations.
 * @returns {Promise<Array>} A list of products.
 */
export const getAllProducts = async () => {

    const products = await prisma.product.findMany({
        include: {
            category: { select: { id: true, name: true } },
            owner: { select: { id: true, name: true } },
        },
    });

    return {
        status: true,
        data: products,
        message: 'Products found successfully'
    }
};

export const getUserProduct = async (userId) => {
    const products = await prisma.product.findMany({
        where: { ownerId: userId },
        include: {
            category: { select: { id: true, name: true } },
            owner: { select: { id: true, name: true } },
        },
    });
    return products;
};

/**
 * Get a single product by its ID.
 * @param {number} productId - The ID of the product to find.
 * @returns {Promise<Object>} The product object.
 * @throws {Error} If the product is not found.
 */
export const getProductById = async (productId) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            category: true,
            owner: { select: { id: true, name: true } },
        },
    });

    if (!product) {
        return {
            status: false,
            message: 'Product not found'
        }
    }

    return {
        status: true,
        data: product,
        message: 'Product found successfully'
    }
};

/**
 * Create a new product in the database.
 * @param {Object} productData - The data for the new product.
 * @returns {Promise<Object>} The newly created product.
 */
export const createProduct = async (productData) => {
    try {
        const product = await prisma.product.create({
            data: productData,
        });
        
        return {
            status: true,
            data: product,
            message: 'Product created successfully'
        }

    } catch (error) {
        console.log(error.message)
        return {
            status: false,
            message: error.message,
            data: []
        }
    }
};

/**
 * Update a product's data by its ID.
 * @param {number} productId - The ID of the product to update.
 * @param {Object} productData - The new data for the product.
 * @returns {Promise<Object>} The updated product.
 */
export const updateProductById = async (productId, productData) => {
    try {
        await getProductById(productId); // Ensure product exists before updating
        
        const product = await prisma.product.update({
            where: { id: productId },
            data: productData,
        });

        return {
            status: true,
            data: product,
            message: 'Product updated successfully'
        }
    } catch (error) {
        console.log(error.message);
        return {
            status: false,
            message: error.message,
            data: []
        }
    }

};

/**
 * Delete a product by its ID.
 * @param {number} productId - The ID of the product to delete.
 */
export const deleteProductById = async (productId) => {
    await getProductById(productId); // Ensure product exists before deleting
    await prisma.product.delete({
        where: { id: productId },
    });
};

// CREATE VARIANT AND STORE STOCK
export const createProductVariant = async (productId, variantData) => {
    try {
        // SEARCH PRODUCT BY ID IS VALID PRODUCT OR NOT
        const product = await prisma.product.findUnique({
            where: {id: productId},
        });

        if(!product) {
            return {
                status: false,
                message: 'Product not found'
            }
        }

        // BEGIN CREATE VARIANTS
        await prisma.variant.create({
            data: variantData,
        });

        return {
            status: true,
            data: variantData,
            message: 'Variant created successfully'
        }
    } catch (error) {
        console.log(error.message);
        return {
            status: false,
            message: error.message
        }
    }
}

export const getProductVariantsList = async () => {
    try {
        const variants = await prisma.variant.findMany();
        return {
            status: true,
            data: variants,
            message: 'Variants found successfully'
        }
    } catch (error) {
        console.log(error.message);
        return {
            status: false,
            message: error.message,
            data: []
        }
    }
}

export const getProductVariantsDetail = async (variantId) => {
    try {
        const variant = await prisma.variant.findUnique({
            where: {id: variantId},
        });
        return {
            status: true,
            data: variant,
            message: 'Variant found successfully'
        }
    } catch (error) {
        console.log(error.message);
        return {
            status: false,
            message: error.message,
            data: []
        }
    }
}

export const updateProductVariant = async (variantId, variantData) => {
    try {
        // SEARCH FIRTS IS VARIANT EXIST OR NOT
        const variantExist = await prisma.variant.findUnique({
            where: {id: variantId},
        });

        if(!variantExist) {
            return {
                status: false,
                message: 'Variant not found'
            }
        }

        const variant = await prisma.variant.update({
            where: {id: variantId},
            data: variantData,
        });

        return {
            status: true,
            data: variant,
            message: 'Variant updated successfully'
        }
    } catch (error) {
        console.log(error.message);
        return {
            status: false,
            message: error.message,
            data: []
        }
    }
}

export const deleteProductVariant = async (variantId) => {
    try {
        // SEARCH FIRTS IS VARIANT EXIST OR NOT
        const variantExist = await prisma.variant.findUnique({
            where: {id: variantId},
        });

        if(!variantExist) {
            return {
                status: false,
                message: 'Variant not found'
            }
        }

        const variant = await prisma.variant.delete({
            where: {id: variantId},
        });

        return {
            status: true,
            data: variant,
            message: 'Variant deleted successfully'
        }
        
    } catch (error) {
        console.log(error.message);
        return {
            status: false,
            message: error.message,
            data: []
        }
    }
}