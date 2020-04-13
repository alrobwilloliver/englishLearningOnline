const express = require('express');
const classController = require('./../controllers/classesController');

const router = express.Router();

router.route('/').get(classController.getClasses);
router.route('/:id').get(classController.getClass);

module.exports = router;