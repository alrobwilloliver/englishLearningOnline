const Course = require('./../models/courseModel');
const catchAsync = require('./../utils/catchAsync');
const Class = require('./../models/classModel');

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

exports.getAllByCourse = catchAsync(async (req, res, next) => {
    let filter = {};

    if (req.params.courseId) filter = { course: req.params.courseId }

    const classes = await Class.find(filter)

    res.status(200).json({
        status: 'success',
        results: classes.length,
        data: classes
    })
})