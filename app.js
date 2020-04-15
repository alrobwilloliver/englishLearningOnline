const express = require('express');
const morgan = require('morgan');
const courseRouter = require('./routes/courseRoutes');
const classRouter = require('./routes/classRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const path = require('path');

const app = express();

// Middleware

app.use(express.static(path.join(__dirname, 'public')))

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

// Routes
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/classes', classRouter);
app.use('/api/v1/users', userRouter);

// error handling

app.all('*', (req, res, next) => {
    return next(new AppError(`Can't find the url ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler);


module.exports = app;