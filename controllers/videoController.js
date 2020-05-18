const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const catchAsync = require('../utils/catchAsync');
const mongodb = require('mongodb');

exports.getVideo = catchAsync(async (req, res, next) => {
    let bucket = new mongodb.GridFSBucket(mongoose.connection.db)
    // const gfs = Grid(mongoose.connection.db, mongoose.mongo)

    const name = 'Lecture-10-Video.mp4';

    const range = req.headers.range;
    if (range) {
        console.log(range);
        const fileSize = 355190999;

        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1
        const chunksize = (end - start) + 1;

        // const readStream = gfs.createReadStream(name);
        let downloadStream = bucket.openDownloadStreamByName(name, { start, end })

        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }

        res.writeHead(206, head);

        downloadStream.on('data', (chunk) => {
            res.write(chunk);
        })

        downloadStream.on('error', () => {
            res.sendStatus(404);
        })

        downloadStream.on('end', () => {
            res.end();
        })
        // readStream.pipe(res);



    } else {
        const fileSize = 355190999;
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        let downloadStream = bucket.openDownloadStreamByName(name);

        downloadStream.on('data', () => {
            res.writeHead(200, head);
            res.write();
        })
        // gfs.createReadStream('Lecture-10-Video.mp4').pipe(res);

        downloadStream.on('error', () => {
            res.sendStatus(404);
        });

        downloadStream.on('end', () => {
            res.end();
        });

    }
})