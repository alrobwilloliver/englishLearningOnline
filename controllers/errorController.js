const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invalid token, please login again!', 401);

const handleJWTExpired = () => new AppError('Your token has expired, please login again.', 401)

const handleDuplicateFieldsDB = err => {

    const value = err.keyValue.name;
    const message = `Duplicate field value: ${value}, please use another value.`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errorMsgs = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errorMsgs.join('. ')}`;
    return new AppError(message, 400);
}

const sendErrDev = (err, req, res) => {
    // API
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // Rendered Website
        console.error('ERROR:', err);

        res.status(err.statusCode).render('pages/error', {
            title: 'Error!',
            msg: err.message
        })
    }
}

const sendErrProd = (err, req, res) => {
    // A. API
    if (req.originalUrl.startsWith('/api')) {
        // Operational, trusted error: send message to client
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });

            //Programming or other unknown error: don't leak error details
        } else {
            // 1 Log Error
            console.error('ERROR:', err);

            // 2 response to client
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong!'
            })
        }
    } else {
        // B. Rendered Website
        if (err.isOperational) {
            res.status(err.statusCode).render('pages/error', {
                title: 'Error!',
                msg: err.message
            })

            //Programming or other unknown error: don't leak error details
        } else {
            // 1 Log Error
            console.error('ERROR:', err);

            // 2 response to client
            res.status(err.statusCode).render('pages/error', {
                title: 'Error!',
                msg: 'Please try again later.'
            })
        }
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpired();

        sendErrProd(error, req, res);
    }
};