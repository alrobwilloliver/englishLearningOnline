const AppError = require('../utils/appError');
const Class = require('../models/classModel');
const catchAsync = require('../utils/catchAsync');

exports.getHome = (req, res, next) => {
    res.render('pages/index', {
        title: 'Home'
    })
}

exports.getOneOfCourse = catchAsync(async (req, res, next) => {
    let filter = {};
    if (!req.params.courseId || !req.params.classId) next(new AppError('This record doesn\'t exist!', 500));

    filter = { $and: [{ _id: req.params.classId }, { course: req.params.courseId }] }

    const lesson = await Class.findOne(filter);

    res.render('pages/class', {
        status: 'success',
        data: lesson
    })
})

exports.getAllOfCourse = catchAsync(async (req, res, next) => {
    let filter = {};

    if (req.params.courseId) filter = { course: req.params.courseId }

    const classes = await Class.find(filter)

    res.render('pages/classes', {
        status: 'success',
        results: classes.length,
        data: classes,
    })
})

exports.getLoginForm = (req, res) => {
    res.status(200).render('pages/login', {
        title: 'Login'
    })
}

exports.myAccount = (req, res, next) => {
    res.status(200).render('pages/account', { title: 'Login' })
}