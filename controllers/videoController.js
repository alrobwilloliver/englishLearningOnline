// const mongoose = require('mongoose');
// const Grid = require('gridfs-stream');
const catchAsync = require('../utils/catchAsync');
const AWS = require('aws-sdk');
const fs = require('fs');
const streamifier = require('streamifier');

exports.getVideo = catchAsync(async (req, res, next) => {
    
    // 1) Get the video from s3 in response
    // AWS.config.update({
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //     region: process.env.AWS_REGION
    // });

    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    const bucketParams = {
        Bucket: process.env.AWS_BUCKET,
        Key: 'Lecture 12 - Dream House.mp4',
    };
    const sessionParams = {
        maxPartSize: 20,//default 20MB
        concurrentStreams: 5,//default 5
        maxRetries: 3,//default 3
        totalObjectSize: 1583489971//required size of object being downloaded
    }
    const downloader = require('s3-download')(s3);
    const d = downloader.download(bucketParams, sessionParams)

    d.on('error', function(err) {
        console.log(err)
    })

    d.on('part', function(part) {
        console.log(part)
    })

    d.on('downloaded', function(end) {
        console.log(end)
    })
    
    // 2) Write the response in to a local file with a write stream
    const writeStream = fs.createWriteStream('/video/class.mp4');
    d.pipe(writeStream);
    // 3) Create a read stream to read the video file
    
})

/*

const readStream = fs.createReadStream('/video/class.mp4');
            const vidData = []

            readStream.on('data', (chunk) => {
                data.push(chunk);
                console.log('data: ', chunk, chunk.length)
            })

s3.listObjects(bucketParams, function(err, data) {
    if (err) {
        console.log('error', err);
    } else {
        res.status(200).json({
            status: 'success',
            data: data
        })
    }
});

*/
