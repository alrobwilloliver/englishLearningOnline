const mongoose = require('mongoose');
// const Grid = require('gridfs-stream');
const mongodb = require('mongodb');

exports.getVideo = (req, res) => {
    let bucket = new mongodb.GridFSBucket(mongoose.connection.db)

    const name = 'Lecture-10-Video.mp4';
    const fileSize = 355190999;

    var range = req.headers.range;
    console.log(range);
    var parts = range.replace(/bytes=/, "").split("-");
    console.log(parts);
    var start = parseInt(parts[0], 10);
    var end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    var chunksize = (end - start) + 1;
    console.log(start, end, chunksize)

    res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + fileSize,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4"
    });

    let downloadStream = bucket.openDownloadStreamByName(name, { start, end })

    // console.log(downloadStream);



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
} 