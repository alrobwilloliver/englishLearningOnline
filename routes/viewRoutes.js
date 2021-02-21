const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authenticationController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', bookingController.createBookingCheckout, viewController.getHome);

router.get('/login', viewController.getLoginForm)

router.get('/signup', (req, res, next) => {
    res.render('pages/signup')
})

router.get('/passwordEmailReset', viewController.forgetPassword);

router.get('/resetPassword/:resetToken', (req, res, next) => {
    res.render('pages/passwordEmailReset', { resetToken: req.params.resetToken })
});
router.patch('/passwordReset/:resetToken', authController.forgetPassword);

router.get('/me', authController.protect, viewController.myAccount)

router.get('/mycourses', authController.protect, viewController.getMyCourses)

router.get('/courses', viewController.getAllCourses)
// we need a route here to protect for to check that the user has purchased a course first
router.get('/courses/:courseId', authController.protect, viewController.getAllOfCourse)

router.get('/courses/:courseId/classes', authController.protect, viewController.getCourseInfo)

router.get('/courses/:courseId/classes/:classId/video', authController.protect, viewController.getOneOfCourse)

router.post('/submit-user-data', authController.protect, viewController.updateUserData)

module.exports = router;