import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';

export const registerUser = async (email, password) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { email, password: hashedPassword },
        select: { id: true, email: true, createdAt: true },
    });

    return user;
};

export const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const getUserById = async (id) => {
    return prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, createdAt: true },
    });
};