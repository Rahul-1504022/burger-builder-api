//install packages
//dotenv,express,morgan,bcrypt,jsonwebtoken
//joi,lodash,cors


const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');

//connect mongodb
const { connect } = require('mongoose');
connect(process.env.MONGODB_SERVER)
    .then(() => console.log("Connect with server successfully!"))
    .catch((err) => console.log("Connection Failed!"));

//define port
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})