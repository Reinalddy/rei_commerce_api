import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './modules/users/user.route.js';

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error('🔥 Error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

export default app;