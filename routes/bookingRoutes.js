const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authenticationController');
const Booking = require('../models/bookingModel');

const router = express.Router();

router.get('/', bookingController.getAllBookings);
// router.get('/', authController.isLoggedIn, bookingController.checkMyBooking)
router.get('/checkout-session/:courseId', authController.protect, bookingController.getCheckoutSession)

module.exports = router;