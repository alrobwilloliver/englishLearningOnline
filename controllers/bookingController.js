const Stripe = require('stripe')
const Course = require('./../models/courseModel');
const catchAsync = require('./../utils/catchAsync');
const Class = require('./../models/classModel');
const AppError = require('./../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {

    const stripe = Stripe(process.env.STRIPE_KEY);

    // 1) Get the currently booked course
    const course = await Course.findById(req.params.courseId)

    // 2) Create the checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/course/${course._id}`,
        customer_email: req.user.email,
        client_reference_id: req.params.courseId,
        line_items: [
            {
                name: `${course.title} Course`,
                description: 'A great course to learn from Alan on AILO, your online learning platform',
                images: [course.image],
                amount: 1000,
                currency: 'usd',
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