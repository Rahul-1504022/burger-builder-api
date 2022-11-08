const express = require('express');
const compression = require('compression');
const cors = require('cors');
const userRouter = require('./routers/userRouter');
//cross origin resource sharing = cors
const orderRouter = require('./routers/orderRouter');
const paymentRouter = require('./routers/paymentRouter');

const app = express();

app.use(cors());
app.use(express.json());
app.use(compression());

app.use('/user', userRouter);
app.use('/order', orderRouter);
app.use('/payment', paymentRouter);

module.exports = app;