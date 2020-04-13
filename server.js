const app = require('./app');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' })

const port = 4000;
app.listen(port, () => {
    console.log(`Listening to server on port ${port}...`)
})