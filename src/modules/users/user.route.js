import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getProfile } from './user.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

// Register
router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
        body('name').isLength({ min: 3 }).withMessage('Name min 3 chars'),
    ],
    register
);

// Login
router.post(
    '/login',
    [
        body('email').isEmail(),
        body('password').notEmpty(),
    ],
    login
);

// Protected route
router.get('/profile', authMiddleware, getProfile);

export default router;