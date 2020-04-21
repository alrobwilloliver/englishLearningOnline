const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Class = require('../models/classModel');
const Course = require('../models/courseModel');
const User = require('../models/userModel');

dotenv.config({ path: './config.env' })
// console.log(process.env);
// console.log(__dirname);


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB Connection Successful!'));

// read json file
const courses = JSON.parse(fs.readFileSync(`${__dirname}/data/courses.json`, 'utf-8'));
const classes = JSON.parse(fs.readFileSync(`${__dirname}/data/classes.json`, 'utf-8'));
// const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8'));

const importData = async () => {
    try {
        await Course.create(courses);
        await Class.create(classes);
        // await User.create(users);
        console.log('Data successfully imported');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

const deleteData = async () => {
    try {
        await Class.deleteMany();
        await Course.deleteMany();
        // await User.deleteMany();
        console.log('Data successfully deleted');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
