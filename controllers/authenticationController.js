const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { promisify } = require('util');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createAndSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions)

    //remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}

exports.signUp = catchAsync(async (req, res, next) => {

    const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
    })

    createAndSendToken(newUser, 201, res);

})

exports.login = catchAsync(async (req, res, next) => {
    const { username, password } = req.body;

    // check username and password are submitted
    if (!username || !password) next(new AppError('Please supply correct username or password', 400))

    // find user by the username
    const user = await User.findOne({ username }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) next(new AppError('Username or password is incorrect!', 401));

    createAndSendToken(user, 200, res);

})

exports.protect = catchAsync(async (req, res, next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please login for access.', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists', 401));
    }

    if (currentUser.changedPasswordAt(decoded.ait)) {
        return next(new AppError('User recently changed password. Please login again', 401));
    }

    req.user = currentUser;
    next();

})

// Only for rendered pages -- no errors
exports.isLoggedIn = catchAsync(async (req, res, next) => {

    if (req.cookies.jwt) {
        // verifies the token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

        // check if the user exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next()
        }

        // check if the user changes password after token was issued
        if (currentUser.changedPasswordAt(decoded.ait)) {
            return next()
        }

        // THRERE IS A LOGGED IN USER
        res.locals.user = currentUser;
        return next();
    }
    next()
})

exports.forgetPassword = catchAsync(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError('There is no user with that email', 404));
    }

    const resetToken = user.createPasswordResetToken()

    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Go to the link and submit your new password and password confirm at ${resetUrl}\n If you didn't forget your password ignore this email.`;
    const subject = 'Password Reset (only available for 10 mins)'
    try {
        await sendEmail({ message, subject, email: user.email })

        res.status(200).json({
            status: 'success',
            message: 'Email sent successfully!'
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false })

        return next(new AppError('There was a problem sending the email!', 500));

    }

})

exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })

    if (!user) {
        return next(new AppError('The token has expired or is invalid', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    createAndSendToken(user, 200, res)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError('Your current password is incorrect.', 400))
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createAndSendToken(user, 200, res);
})

exports.restrictTo = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You don\'t have permission to complete this action', 400));
        }

        next();
    }

}