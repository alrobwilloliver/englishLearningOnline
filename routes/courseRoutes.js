const express = require('express');
const coursesController = require('./../controllers/coursesController');

const router = express.Router();

router.route('/').get(coursesController.getAllCourses);
router.route('/:id').get(coursesController.getCourse);

module.exports = router;