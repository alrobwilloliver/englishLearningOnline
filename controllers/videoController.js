const mongoose = require('mongoose');
// const Grid = require('gridfs-stream');
const catchAsync = require('../utils/catchAsync');
const mongodb = require('mongodb');

exports.getVideo = catchAsync(async (req, res, next) => {
    let bucket = new mongodb.GridFSBucket(mongoose.connection.db)
    // const gfs = Grid(mongoose.connection.db, mongoose.mongo)

    const name = 'Lecture-10-Video.mp4';
    const fileSize = 355190999;

    const range = req.headers.range;
    const headers = req.headers;
    console.log(range);
    if (range) {
        // console.log(range);

        const parts = range.replace(/bytes=/, "").split("-")
        console.log(parts);
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1
        // console.log(end);
        const chunksize = (end - start) + 1;
        console.log(end, start, chunksize);

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
            // console.log(chunk.length - chunksize);
            res.write(chunk);
        })

        downloadStream.on('error', () => {
            res.sendStatus(404);
        })

        downloadStream.on('end', () => {
            res.end();
        })

        downloadStream.pipe(res);
        // readStream.pipe(res);



    } else {
        console.log('trigger');
        // const fileSize = 355190999;
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        let downloadStream = bucket.openDownloadStreamByName(name);
        res.writeHead(200, head);
        downloadStream.on('data', () => {
            downloadStream.pipe(res);
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