const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    difficulty: {
        type: String,
        emun: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    lecture: {
        type: String
    },
    ppt: {
        type: String
    },
    docs: {
        type: String
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: [true, 'This class must belong to a course!']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

const Class = mongoose.model('Class', classSchema);

module.exports = Class;

