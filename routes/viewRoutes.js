const express = require('express');
const Class = require('../models/classModel');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('pages/index', {
        title: 'Home'
    })
})

router.get('/login', (req, res, next) => {
    res.render('pages/login')
})

// router.get('/signup', (req, res, next) => {
//     res.render('pages/signup')
// })

router.get('/classes/:courseId', catchAsync(async (req, res, next) => {
    let filter = {};

    if (req.params.courseId) filter = { course: req.params.courseId }

    const classes = await Class.find(filter)

    const links = classes.map(el => {
        return `/class/${el._id}`
    })

    res.render('pages/classes', {
        status: 'success',
        results: classes.length,
        data: classes,
        links
    })
}))

router.get('/classes', (req, res, next) => {
    res.render('pages/classes')
})

module.exports = router;