const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');

// process.on('uncaughtException', err => {
//     console.log('UNCAUGHT EXCEPTION! Shutting down...')
//     console.log(err.name, err.message)
//     process.exit(1)
// })

dotenv.config({ path: `${__dirname}/config.env` })
// console.log(process.env);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB Connection Successful!'));

const port = 8080;
app.listen(process.env.PORT || port, () => {
    console.log(`Listening to server on port ${port}...`)
})

