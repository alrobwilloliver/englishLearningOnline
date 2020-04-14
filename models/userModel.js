const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
});

userSchema.pre('save', async function (next) {
    // if password is not changed don't hash password
    if (!this.isModified('password')) next();

    // hash password with bcrypt (12 is a safe value -> higher is safer, but more performance heavy)
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;

    next();

})

userSchema.methods.correctPassword = async function (candidatePassword, actualPassword) {
    return await bcrypt.compare(candidatePassword, actualPassword)
}

userSchema.methods.changedPasswordAt = function (JWTTimestamp) {

    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime / 1000, 10)
        // means not changed (time token is issued < changed timestamp)
        return changedTimestamp > JWTTimestamp
    }

    return false;

}
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    console.log({ resetToken }, this.passwordResetToken);

    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;