//install packages
//dotenv,express,morgan,bcrypt,jsonwebtoken
//joi,lodash,cors


const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const DB = process.env.ATLAS_URL_SERVER.replace('<PASSWORD>', process.env.ATLAS_PASS);

global.__basedir = __dirname;
//connect mongodb
const { connect } = require('mongoose');
connect(DB)
    .then(() => console.log("Connect with server successfully!"))
    .catch((err) => console.log(err));

//define port
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})