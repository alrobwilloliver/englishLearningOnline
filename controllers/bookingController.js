const Stripe = require('stripe')
const Course = require('./../models/courseModel');
const catchAsync = require('./../utils/catchAsync');
const Class = require('./../models/classModel');
const Booking = require('../models/bookingModel');
const AppError = require('./../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {

    const stripe = Stripe(process.env.STRIPE_KEY);

    // 1) Get the currently booked course
    const course = await Course.findById(req.params.courseId)

    // 2) Create the checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?course=${req.params.courseId}&user=${req.user.id}&price=${course.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/course/${course._id}`,
        customer_email: req.user.email,
        client_reference_id: req.params.courseId,
        line_items: [
            {
                name: `${course.title} Course`,
                description: 'A great course to learn from Alan on AILO, your online learning platform',
                images: [course.image],
                amount: 2000,
                currency: 'gbp',
                quantity: 1
            }
        ]
    })
    // 3) Send it to client
    res.status(200).json({
        status: 'success',
        session
    })
})

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    const { course, user, price } = req.query;

    if (!course && !user && !price) return next();

    await Booking.create({ course, user, price });

    res.redirect(req.originalUrl.split('?')[0]);
});

exports.getAllBookings = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find()

    res.status(200).json({
        status: 'success',
        bookings
    })
})

exports.checkMyBooking = catchAsync(async (req, res, next) => {

    const { courseId } = req.params;
    const myBooking = await Booking.find({ $and: [ { user: { _id: req.user.id } }, { course: { _id: courseId } } ] })
    if (!myBooking || myBooking.length === 0) next(new AppError('You have not paid for this course yet. Please make your purchase before you can access the classes.', 403))
    next()
})