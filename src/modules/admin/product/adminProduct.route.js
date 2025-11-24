import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateToken, requireAdmin } from '../../../middlewares/auth.middleware.js';
import { createProduct, getAllProducts, createProductVariant, getProductCategory, updateProduct, deleteProduct } from './adminProduct.controller.js';
import { upload } from "../../../middlewares/upload.js";

const router = Router();
// CREATE PRODUCT
router.post("/",authenticateToken, requireAdmin, upload.single("image"), createProduct);
router.put("/:id", authenticateToken, requireAdmin, upload.single("image"), updateProduct);
router.delete("/:id", authenticateToken, requireAdmin, deleteProduct);
router.get("/", authenticateToken, requireAdmin, getAllProducts);
router.get("/category", authenticateToken, requireAdmin, getProductCategory);

// CREATE VARIANT
router.post("/variant", authenticateToken, requireAdmin, upload.single("image"), createProductVariant);

export default router;