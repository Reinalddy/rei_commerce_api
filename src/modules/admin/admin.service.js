import prisma from '../../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';

export const adminLogin = async(email, password) => {
    // CEK EMAIL
    const user = await prisma.user.findUnique({ where: { email },
        select: { id: true, email: true, role: true }
    });
    if (!user) {
        return {
            status: false,
            message: 'Invalid credentials',
        }
    }

    // CEK ROLE
    if(user.role !== "ADMIN") {
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

    return {
        status: true,
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' }),
        adminData : user
    }
}