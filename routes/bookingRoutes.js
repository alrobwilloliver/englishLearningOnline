const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authenticationController');

const router = express.Router();

router.get('/checkout-session/:courseId', authController.protect, bookingController.getCheckoutSession)

module.exports = router;