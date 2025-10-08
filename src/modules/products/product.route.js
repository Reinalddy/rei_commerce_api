import { Router } from 'express';
import { body } from 'express-validator';
import { getAllProducts, getProductById, createProduct, updateProductById, deleteProductById } from './product.controller.js';

const router = Router();

// GET ALL PRODUCT
router.get("/", getAllProducts);
// GET PRODUCT BY ID
router.get("/:id", getProductById);
// CREATE PRODUCT
router.post("/", createProduct);
// UPDATE PRODUCT
router.put("/:id", updateProductById);
// DELETE PRODUCT
router.delete("/:id", deleteProductById);

export default router;