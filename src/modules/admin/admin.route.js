import { Router } from 'express';
import { body } from 'express-validator';
import { login } from './admin.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

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