var GridStore = require('mongodb').GridStore;
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: "./../config.env" })

// var dbConnection;
// MongoClient.connect("mongodb://localhost:27017/ersatz?auto_reconnect", {journal: true}, function(err, db) {
//   dbConnection = db;
//   app.listen(3000);
// });

const dbConnection = MongoClient.connect('mongodb+srv://alan:sqM5f16UGDdDCxwg@cluster0-4sz1g.mongodb.net/englishLearningOnline?retryWrites=true&w=majority').then(function (db) { return db }).catch((err) => {
    console.log(err);
})

console.log(111, dbConnection);

function StreamGridFile(req, res, GridFile) {
    if (req.headers['range']) {

        // Range request, partialle stream the file
        console.log('Range Request');
        var parts = req.headers['range'].replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : GridFile.length - 1;
        var chunksize = (end - start) + 1;

        console.log('Range ', start, '-', end);

        res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + GridFile.length,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': GridFile.contentType
        });

        // Set filepointer
        GridFile.seek(start, function () {
            // get GridFile stream
            var stream = GridFile.stream(true);

            // write to response
            stream.on('data', function (buff) {
                // count data to abort streaming if range-end is reached
                // perhaps theres a better way?
                start += buff.length;
                if (start >= end) {
                    // enough data send, abort
                    GridFile.close();
                    res.end();
                } else {
                    res.write(buff);
                }
            });
        });

    } else {

        // stream back whole file
        console.log('No Range Request');
        res.header('Content-Type', GridFile.contentType);
        res.header('Content-Length', GridFile.length);
        var stream = GridFile.stream(true);
        stream.pipe(res);
    }
}

// app.get('/', function(req, res) {
//   console.log('GET request');
//   new GridStore(dbConnection, new ObjectID("526652540d9e077978000230"), null, 'r').open(function(err, GridFile) {
//     if(!GridFile) {
//       res.send(404,'Not Found');
//       return;
//     }

//     StreamGridFile(req, res, GridFile)
//   });
// });

exports.getVideo = ((req, res, next) => {
    console.log('Get request');
    new GridStore(dbConnection, new ObjectID("5eab391414738445d583e804"), null, "r").open(function (err, GridFile) {
        if (!GridFile) {
            res.send(404, 'Not Found');
            return;
        }
        StreamGridFile(req, res, GridFile)
    });

})