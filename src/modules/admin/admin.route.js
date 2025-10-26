import { Router } from 'express';
import { body } from 'express-validator';
import { login } from './admin.controller.js';
import { authenticateToken , requireAdmin} from '../../middlewares/auth.middleware.js';
import { createProduct } from '../products/product.controller.js';
import { upload } from "../../middlewares/upload.js";

const router = Router();

// ADMIN LOGIN
router.post(
    '/login',
    [
        body('email').isEmail(),
        body('password').notEmpty(),
    ],
    login
);

router.post("/create-product", authenticateToken, requireAdmin, upload.single("image"), createProduct)

export default router;