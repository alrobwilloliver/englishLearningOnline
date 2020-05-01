const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const catchAsync = require('../utils/catchAsync');

exports.getVideo = catchAsync(async (req, res, next) => {
    const gfs = Grid(mongoose.connection.db, mongoose.mongo)
    const readStream = gfs.createReadStream('Lecture-10-Video.mp4')

    readStream.pipe(res);
})