const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/config.env` })
// console.log(process.env);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);


try {
    mongoose.connect(DB, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    console.log('database successfully connected')
} catch (err) {
    console.log(err)
}

const port = 4000;
app.listen(port, () => {
    console.log(`Listening to server on port ${port}...`)
})

