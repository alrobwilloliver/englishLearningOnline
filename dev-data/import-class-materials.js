const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Grid = require('gridfs-stream');

dotenv.config({ path: './config.env' })

Grid.mongo = mongoose.mongo;

const dbString = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const conn = mongoose.createConnection(dbString);

const videoPath = path.join(__dirname, './class-materials/Class-10-Time-Video-Compressed.mp4');

conn.once('open', function () {
    console.log('Connection open...');
    const gfs = Grid(conn.db);

    var writeStream = gfs.createWriteStream({
        filename: 'Lecture-10-Video.mp4'
    })

    fs.createReadStream(videoPath).pipe(writeStream)

    writeStream.on('close', function (file) {
        console.log(file.filename + ' Written to DB')
    })
})
