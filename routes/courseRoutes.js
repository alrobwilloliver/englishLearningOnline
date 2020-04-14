const express = require('express');
const coursesController = require('./../controllers/coursesController');
const authController = require('./../controllers/authenticationController');

const router = express.Router();

router.route('/').get(coursesController.getAllCourses);
router.route('/:id').get(coursesController.getCourse);

router.route('/:courseId/classes').get(authController.protect, coursesController.getAllByCourse);
router.route('/:courseId/classes/:classId').get(authController.protect, coursesController.getOneByCourse);

module.exports = router;