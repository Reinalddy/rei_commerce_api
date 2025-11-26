import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateToken, requireAdmin } from '../../../middlewares/auth.middleware.js';
import * as productController from './adminProduct.controller.js';
import { upload } from "../../../middlewares/upload.js";

const router = Router();
// CREATE PRODUCT
router.post("/", authenticateToken, requireAdmin, upload.single("image"), productController.createProduct);
router.put("/:id", authenticateToken, requireAdmin, upload.single("image"), productController.updateProduct);
router.delete("/:id", authenticateToken, requireAdmin, productController.deleteProduct);
router.get("/", authenticateToken, requireAdmin, productController.getAllProducts);
router.get("/category", authenticateToken, requireAdmin, productController.getProductCategory);

// VARIANT
router.get("/variant/:productId", authenticateToken, requireAdmin, productController.getAllVariants);
router.post("/variant", authenticateToken, requireAdmin, upload.single("image"), productController.createProductVariant);
router.put("/variant/:id", authenticateToken, requireAdmin, upload.single("image"), productController.updateProductVariant);
router.delete("/variant/:id", authenticateToken, requireAdmin, productController.deleteProductVariant);

export default router;