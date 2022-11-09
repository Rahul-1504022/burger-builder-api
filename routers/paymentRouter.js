const express = require('express');
const { Order } = require('../models/order');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const { initPayment } = require('../controllers/paymentController');

router.route('/')
    .get(authorize, initPayment);

module.exports = router;