const express = require('express');
const coursesController = require('./../controllers/coursesController');
const authController = require('./../controllers/authenticationController');
const bookingController = require('../controllers/bookingController')
const videoController = require('../controllers/videoController');

const router = express.Router();

router.route('/').get(authController.isLoggedIn, coursesController.getAllCourses);
// need another method to check user has bought this course
router.route('/:id').get(authController.isLoggedIn, coursesController.getCourse);
router.route('/:courseId/classes').get(authController.protect, coursesController.getAllByCourse);
// router.route('/:courseId/classes/:classId').get(authController.protect, bookingController.checkMyBooking, coursesController.getOneByCourse);


module.exports = router;