// const mongoose = require('mongoose');
// const Grid = require('gridfs-stream');
const catchAsync = require('../utils/catchAsync');
const AWS = require('aws-sdk');
const fs = require('fs');
const streamifier = require('streamifier');
const { request } = require('http');

exports.getVideo = catchAsync(async (req, res, next) => {

    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });

    const s3 = new AWS.S3({
        signatureVersion: 'v4'
    });

    
    const bucketParams = {
        Bucket: process.env.AWS_BUCKET,
        Key: 'Lecture 12 - Dream House.mp4',
        Range: 'bytes=0-49999'
    };
    
    s3.getObject(bucketParams, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log("ENDPOINT", this.request.httpRequest.endpoint);
            console.log(data)
            // const { ContentLength, } = data;
            // const readableStream = streamifier.createReadStream(data.Body.data)

            // 1) Get the video from s3 in response
            // 2) Write the response in to a local file with a write stream
            // 3) Create a read stream to read the video file

            const buffer = Buffer.from(data.Body)
            console.log('length', buffer.length)

            const writeStream = fs.createWriteStream('/video/class.mp4');
            writeStream.path(data.Body)
            
            const readStream = fs.createReadStream('/video/class.mp4');
            const vidData = []

            readStream.on('data', (chunk) => {
                data.push(chunk);
                console.log('data: ', chunk, chunk.length)
            })

            // 1) Get the video from s3 in response
            // 2) Write the response in to a local file with a write stream
            // 3) Create a read stream to read the video file

            
        }
    })
})

/*

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
