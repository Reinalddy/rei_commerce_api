import { Router } from 'express';
import { body } from 'express-validator';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from './product.controller.js';
import { authenticateToken, requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();
// GET PRODUCT ADMIN
router.get("/",authenticateToken, requireAdmin, getAllProducts);
// GET PRODUCT BY ID
router.get("/detail",authenticateToken,requireAdmin, getProductById);
// CREATE PRODUCT
router.post("/",authenticateToken,requireAdmin, createProduct);

// UPDATE PRODUCT
router.put("/update",authenticateToken, updateProduct);
// DELETE PRODUCT
router.delete("/delete",authenticateToken, deleteProduct);

export default router;