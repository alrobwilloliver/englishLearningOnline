const express = require('express');
const Class = require('../models/classModel');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('pages/index', {
        title: 'Home'
    })
})

// router.get('/login', (req, res, next) => {
//     res.render('pages/login')
// })

// router.get('/signup', (req, res, next) => {
//     res.render('pages/signup')
// })

router.get('/courses/:courseId', catchAsync(async (req, res, next) => {
    let filter = {};

    if (req.params.courseId) filter = { course: req.params.courseId }

    const classes = await Class.find(filter)

    res.render('pages/classes', {
        status: 'success',
        results: classes.length,
        data: classes,
    })
}))

router.get('/classes', (req, res, next) => {
    res.render('pages/classes')
})

router.get('/courses/:courseId/classes/:classId', catchAsync(async (req, res, next) => {
    let filter = {};
    if (!req.params.courseId || !req.params.classId) next(new AppError('This record doesn\'t exist!', 500));

    filter = { $and: [{ _id: req.params.classId }, { course: req.params.courseId }] }

    const lesson = await Class.find(filter);
    console.log(lesson)

    res.render('pages/class', {
        status: 'success',
        data: lesson
    })
}))

module.exports = router;