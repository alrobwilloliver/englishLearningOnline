// const mongoose = require('mongoose');
// const Grid = require('gridfs-stream');
const catchAsync = require('../utils/catchAsync');
const AWS = require('aws-sdk');
const fs = require('fs');
const streamifier = require('streamifier');

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
    
    s3.listObjectsV2({ Bucket: process.env.AWS_BUCKET }, function (err, data) {
        let objectData;
        if (err) {
            console.log(err)
        } else {
            console.log(data)
            objectData = data.Contents.filter((e) => e.Key === bucketParams.Key);
            console.log(objectData)
        }
        
    })
    
    s3.getObject(bucketParams, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log("ENDPOINT", this.request.httpRequest.endpoint);
            console.log(data)

            const { ContentLength, } = data;
            const readableStream = streamifier.createReadStream(data.Body.data)
            res.status(200).json({
                status: 'success',
                body: data.Body
            })
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
