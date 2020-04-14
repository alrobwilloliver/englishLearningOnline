const express = require('express');
const classController = require('./../controllers/classesController');
const authController = require('./../controllers/authenticationController');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(classController.getClasses);
router.route('/:id').get(classController.getClass);

module.exports = router;