const Course = require('./../models/courseModel');
const catchAsync = require('./../utils/catchAsync');
const Class = require('./../models/classModel');
const AppError = require('./../utils/appError');

exports.getAllCourses = catchAsync(async (req, res, next) => {
    const courses = await Course.find();
    res.status(200).json({
        status: 'success',
        data: courses
    })
})

exports.getCourse = catchAsync(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    console.log('course', course)
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

exports.getOneByCourse = catchAsync(async (req, res, next) => {

    let filter = {};
    if (!req.params.courseId || !req.params.classId) next(new AppError('This record doesn\'t exist!', 500));

    filter = { $and: [{ _id: req.params.classId }, { course: req.params.courseId }] }

    const lesson = await Class.find(filter);
    // console.log(lesson)
    res.status(200).render('pages/class', {
        status: 'success',
        data: lesson
    })
})