// src/modules/products/product.service.js
import prisma from '../../config/db.js';

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
    return products;
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
        throw new Error('Product not found');
    }
    return product;
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
        return product;
        
    } catch (error) {
        console.log(error.message)
    }
};

/**
 * Update a product's data by its ID.
 * @param {number} productId - The ID of the product to update.
 * @param {Object} productData - The new data for the product.
 * @returns {Promise<Object>} The updated product.
 */
export const updateProductById = async (productId, productData) => {
    await getProductById(productId); // Ensure product exists before updating
    const product = await prisma.product.update({
        where: { id: productId },
        data: productData,
    });
    return product;
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