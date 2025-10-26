import prisma from '../../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const adminLogin = async(email, password) => {

    try {
        // CEK EMAIL
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return {
                status: false,
                message: 'Invalid credentials',
            }
        }
        // CEK ROLE
        if (user.role !== "ADMIN") {
            return {
                status: false,
                message: 'invalid credentials',
            }
        }

        // CEK PASSWORD
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return {
                status: false,
                message: 'Invalid credentials',
            }
        }

        // FILTER DATA USER, JANGAN TAMPILKAN PASSWORD
        delete user.password;

        return {
            status: true,
            token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' }),
            adminData: user
        }
    } catch (error) {
        return {
            status: false,
            message: error.message || 'Internal Server Error'
        }
    }
}