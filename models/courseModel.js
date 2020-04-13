const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    author: {
        type: String
    },
    image: {
        type: String
    }
})

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;