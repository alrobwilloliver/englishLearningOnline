const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cd) => {
//         cd(null, 'public/img/user');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// })
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! Please only upload images', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/user/${req.file.filename}`)

    next();
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        data: users
    })
})

exports.getMe = catchAsync(async (req, res, next) => {
    const currentUser = await User.findById(req.user.id);
    console.log(currentUser)
    if (!currentUser) next(new AppError('Your user doesn\'t exist!', 500));

    res.status(200).json({
        status: 'success',
        data: currentUser
    })
})

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    });
    return newObj;
}

exports.updateMe = catchAsync(async (req, res, next) => {
    // console.log(req.file);
    // console.log(req.body);

    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError('This route is not for updating the user password. Please use /updatePassword', 400)
        )
    }

    // stop unwanted fields from being accessed in this route so can not be updated
    const filteredBody = filterObj(req.body, 'username', 'email');
    if (req.file) filteredBody.photo = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    if (!updatedUser) next(new AppError('Your user doesn\'t exist.', 500));

    res.status(200).json({
        status: 'success',
        data: updatedUser
    })
})