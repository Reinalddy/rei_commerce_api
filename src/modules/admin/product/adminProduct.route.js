import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateToken, requireAdmin } from '../../../middlewares/auth.middleware.js';
import { createProduct, getAllProducts } from './adminProduct.controller.js';
import { upload } from "../../../middlewares/upload.js";

const router = Router();
// CREATE PRODUCT
router.post("/",authenticateToken, requireAdmin, upload.single("image"), createProduct);
router.get("/", authenticateToken, requireAdmin, getAllProducts);

export default router;