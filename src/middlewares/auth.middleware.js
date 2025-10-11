import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET;
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) return res.status(401).json({
            code: 401,
            message: "Token not provided" 
        });

        const payload = jwt.verify(token, JWT_SECRET);
        // attach user minimal data
        const user = await prisma.user.findUnique({ where: { id: payload.id } });
        if (!user) return res.status(401).json({ 
            code: 401,
            message: "User not found" 
        });

        req.user = { id: user.id, email: user.email, role: user.role };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const requireAdmin = (req, res, next) => {
    if (!req.user) return res.status(401).json({
            code: 401,
            message: "Not authenticated" 
        });
    if (req.user.role !== "ADMIN") return res.status(403).json({
        code: 403,
        message: "Who are you?" 
    });
    next();
};