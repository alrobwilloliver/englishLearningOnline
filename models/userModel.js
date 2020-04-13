const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'You must submit a username!'],
        unique: [true, 'This username has been taken. Please choose another.']
    },
    email: {
        type: String,
        unique: [true, 'This email has already been taken. Please choose another'],
        validate: [validator.isEmail, 'Must be a valid email']
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: true,
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: 'Passwords are not the same'
        }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;