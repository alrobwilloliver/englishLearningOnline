const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const catchAsync = require('../utils/catchAsync');

exports.getVideo = catchAsync(async (req, res, next) => {
    const gfs = Grid(mongoose.connection.db, mongoose.mongo)

    const range = req.headers.range;
    // console.log(req.headers);
    if (range) {
        const fileSize = 355190999;
        const chunksize = 261120;
        const name = 'Lecture-10-Video.mp4';

        const readStream = gfs.createReadStream(name);

        // console.log(readStream);


        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1


        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }

        res.writeHead(206, head);
        readStream.pipe(res);
    } else {
        const fileSize = 355190999;
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        gfs.createReadStream('Lecture-10-Video.mp4').pipe(res);
    }

    // readStream.pipe(res);
})