const Course = require('./../models/courseModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllCourses = catchAsync(async (req, res, next) => {
    const courses = await Course.find();
    res.status(200).json({
        status: 'success',
        data: courses
    })
})

exports.getCourse = catchAsync(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: course
    })
})