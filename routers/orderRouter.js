const express = require('express');
const { Order } = require('../models/order');
const router = express.Router();
const authorize = require('../middlewares/authorize');

//new order
const newOrder = async (req, res) => {
    req.body.userId = req.user._id;
    const order = new Order(req.body);
    try {
        await order.save();
        return res.status(201).send("Order Successfully!");
    } catch (err) {
        return res.status(400).send("Sorry! Something went wrong!");
    }
}

//order particular user order list
const orderList = async (req, res) => {
    const orders = await Order.find({ userId: req.user._id }).sort({ orderTime: -1 });
    res.send(orders);
}

router.route('/')
    .get(authorize, orderList)
    .post(authorize, newOrder)

module.exports = router;
