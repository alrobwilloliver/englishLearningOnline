const AppError = require('../utils/appError');
const Class = require('../models/classModel');
const Course = require('../models/courseModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getHome = (req, res, next) => {
    res.render('pages/index', {
        title: 'Home'
    })
}

exports.getAllCourses = (req, res, next) => {
    res.render('pages/courses');
}

exports.getCourseInfo = catchAsync(async (req, res, next) => {
    const course = await Course.findById(req.params.courseId);
    res.render('pages/course-info', { course })
})

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

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        username: req.body.name,
        email: req.body.email
    },
        {
            new: true,
            runValidators: true
        })

    res.status(200).render('pages/account', { title: 'Account', user: updatedUser });

})

exports.forgetPassword = (req, res, next) => {
    res.status(200).render('pages/resetPassword');
}

exports.createNewPasswordWithEmailToken = (req, res, next) => {
    res.status(200).render('pages/passwordEmailReset');
}