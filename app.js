const express = require('express');
const morgan = require('morgan');
const courseRouter = require('./routes/courseRoutes');

const app = express();

// Middleware

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// app.get('/', (req, res, next) => {
//     console.log('Hello!')
// })

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use('/api/v1/courses', courseRouter);

module.exports = app;