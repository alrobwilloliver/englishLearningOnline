const express = require('express');
const morgan = require('morgan');
const courseRouter = require('./routes/courseRoutes');
const classRouter = require('./routes/classRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middleware

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

// Routes
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/classes', classRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;