const express = require('express');
const morgan = require('morgan');
const courseRouter = require('./routes/courseRoutes');
const classRouter = require('./routes/classRoutes');
const userRouter = require('./routes/userRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname + '/public')))

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({
    extended: true,
    limit: '10kb'
}))

app.use((req, res, next) => {
    // console.log(req.cookies);
    next();
})

app.use(function (req, res, next) {

    if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico' || req.originalUrl.split("/").pop() === 'favicon.png') {
        return res.sendStatus(204);
    }

    return next();

});

// Routes

app.use('/', viewRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/classes', classRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookings', bookingRouter);

// error handling

app.all('*', (req, res, next) => {
    return next(new AppError(`Can't find the url ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler);


module.exports = app;