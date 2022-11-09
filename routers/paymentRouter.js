const express = require('express');
const { Order } = require('../models/order');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const { initPayment, ipn, paymentSuccess, paymentFailed, paymentCanceled } = require('../controllers/paymentController');

router.route('/')
    .get(authorize, initPayment);

router.route('/ipn')
    .post(ipn);

router.route('/success')
    .post(paymentSuccess);

router.route('/failed')
    .post(paymentFailed);

router.route('/cancel')
    .post(paymentCanceled);

module.exports = router;