const express = require('express');
const Class = require('../models/classModel');
const catchAsync = require('../utils/catchAsync');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewController.getHome)

// router.get('/login', (req, res, next) => {
//     res.render('pages/login')
// })

// router.get('/signup', (req, res, next) => {
//     res.render('pages/signup')
// })

router.get('/courses/:courseId', viewController.getAllOfCourse)

router.get('/classes', (req, res, next) => {
    res.render('pages/classes')
})

router.get('/courses/:courseId/classes/:classId', viewController.getOneOfCourse)

module.exports = router;