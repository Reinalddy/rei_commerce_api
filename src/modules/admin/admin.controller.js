import { validationResult } from 'express-validator';
import * as adminService from './admin.service.js';

export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;
        const response = await adminService.adminLogin(email, password);
        if(response.status === false) return res.status(401).json({ code: 401, message: response.message, token: null });

        res.status(200).json({ 
            code: 200,
            message: 'Login successful', 
            data : {
                token: response.token,
                data: response.adminData
            }
        });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};