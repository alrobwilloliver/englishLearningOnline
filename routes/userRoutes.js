const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authenticationController');

const router = express.Router();

// authentication
router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);

router.route('/forgetPassword').post(authController.forgetPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router.route('/changePassword').patch(authController.protect, authController.updatePassword);

router.route('/').get(authController.protect, authController.restrictTo('admin'), userController.getAllUsers)

router.route('/me').get(authController.protect, userController.getMe)

module.exports = router;