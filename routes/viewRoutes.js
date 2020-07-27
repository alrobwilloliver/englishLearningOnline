const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authenticationController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewController.getHome)

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

router.get('/courses/:courseId', viewController.getAllOfCourse)

router.get('/courses/:courseId/classes/:classId', authController.protect, viewController.getOneOfCourse)

router.post('/submit-user-data', authController.protect, viewController.updateUserData)

module.exports = router;