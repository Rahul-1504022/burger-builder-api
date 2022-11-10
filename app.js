const express = require('express');
const compression = require('compression');
const cors = require('cors');
const userRouter = require('./routers/userRouter');
//cross origin resource sharing = cors
const orderRouter = require('./routers/orderRouter');
const paymentRouter = require('./routers/paymentRouter');

const app = express();

app.use(cors());
app.use(express.json()); //use to handle post request in JSON format
app.use(compression());
app.use(express.urlencoded({ extended: true })); //use to handle post URL format
app.use(express.static('public'));

app.use('/user', userRouter);
app.use('/order', orderRouter);
app.use('/payment', paymentRouter);

module.exports = app;