const Class = require('./../models/classModel');
const catchAsync = require('./../utils/catchAsync');

exports.getClasses = catchAsync(async (req, res, next) => {
    const classes = await Class.find();
    res.status(200).json({
        status: 'success',
        data: classes
    })
})

exports.getClass = catchAsync(async (req, res, next) => {
    const lesson = await Class.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: lesson
    })
})