const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        data: users
    })
})

exports.getMe = catchAsync(async (req, res, next) => {
    const currentUser = await User.findById(req.user.id);

    if (!currentUser) next(new AppError('Your user doesn\'t exist!', 500));

    res.status(200).json({
        status: 'success',
        data: currentUser
    })
})

exports.updateMe = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!updatedUser) next(new AppError('Your user doesn\'t exist.', 500));

    res.status(200).json({
        status: 'success',
        data: updatedUser
    })
})