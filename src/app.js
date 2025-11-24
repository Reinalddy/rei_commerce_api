import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './modules/users/user.route.js';
import productRoutes from './modules/products/product.route.js';
import adminProductRoutes from './modules/admin/product/adminProduct.route.js';
import adminRoutes from './modules/admin/admin.route.js';
import path from "path";

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
// PRODUCTS
app.use('/api/products', productRoutes);

// ADMIN
app.use("/api/admin", adminRoutes)
// ADMIN PRODUCT
app.use("/api/admin/products", adminProductRoutes)

// ROUTE FOR VIEW IMAGE
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Error handling
// Global Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 ERROR:", err); // log full error on server

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        code: statusCode,
        message: err.message || "Something went wrong",
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
            name: err.name
        })
    });
});


export default app;