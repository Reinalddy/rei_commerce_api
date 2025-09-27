import { validationResult } from 'express-validator';
import * as userService from './user.service.js';

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password, name } = req.body;
        const user = await userService.registerUser(email, password, name);

        res.status(201).json({ message: 'User registered', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;
        const response = await userService.loginUser(email, password);
        if(response.status === false) return res.status(401).json({ code: 401, message: response.message, token: null });

        res.status(200).json({ message: 'Login successful', token: response.token });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.id);
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};