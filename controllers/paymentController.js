const { model } = require('mongoose');
const path = require('path');
const sslCommerz = require('ssl-commerz-node');
const { Order } = require('../models/order');
const { Payment } = require('../models/payment');
const PaymentSession = sslCommerz.PaymentSession;

module.exports.ipn = async (req, res) => {
    const payment = new Payment(req.body);
    const tran_id = payment['tran_id'];
    if (payment['status'] === "VALID") {
        await Order.updateOne({ transaction_id: tran_id }, { "customer.paymentType": "paid" });
    }

    else if (payment['status'] === "FAILED") {
        await Order.deleteOne({ transaction_id: tran_id });
    }

    else if (payment['status'] === "CANCELLED") {
        // const order = await Order.updateOne({ transaction_id: tran_id }, { status: "Pending" });
        await Order.deleteOne({ transaction_id: tran_id });
    }
    await payment.save();
    return res.status(200).send("IPN");
}

module.exports.initPayment = async (req, res) => {
    const userID = req.user._id;
    const tran_id = '_' + Math.random().toString(36).substr(2, 9) + (new Date()).getTime();
    const userOrder = await Order.findOne({ userId: userID, "customer.paymentType": "paynow" })  //object key can be accessed using this way
    const total_amount = userOrder.totalPrice;
    const { name, email, city, postcode, country, address, phone, state } = userOrder.customer;
    const payment = new PaymentSession(
        true,
        process.env.STORE_ID,
        process.env.STORE_PASSWORD
    );

    // Set the urls
    payment.setUrls({
        success: "https://salty-woodland-88546.herokuapp.com/payment/success", // If payment Succeed
        fail: "https://salty-woodland-88546.herokuapp.com/payment/failed", // If payment failed
        cancel: "https://salty-woodland-88546.herokuapp.com/payment/cancel", // If user cancel payment
        ipn: "https://salty-woodland-88546.herokuapp.com/payment/ipn", // SSLCommerz will send http post request in this link
    });

    // Set order details
    payment.setOrderInfo({
        total_amount: total_amount, // Number field
        currency: "BDT", // Must be three character string
        tran_id: tran_id, // Unique Transaction id
        emi_option: 0, // 1 or 0
    });

    // Set customer info
    payment.setCusInfo({
        name: name,
        email: email,
        add1: address,
        add2: address,
        city: city,
        state: state,
        postcode: postcode,
        country: country,
        phone: phone,
        fax: phone,
    });

    // Set shipping info
    payment.setShippingInfo({
        method: "Courier", //Shipping method of the order. Example: YES or NO or Courier
        num_item: 1,
        name: name,
        add1: address,
        add2: address,
        city: city,
        state: state,
        postcode: postcode,
        country: country,
    });

    // Set Product Profile
    payment.setProductInfo({
        product_name: "Bohubrihi Burger",
        product_category: "Food",
        product_profile: "food",
    });
    let response = await payment.paymentInit(); //initiate payment

    if (response.status === "SUCCESS") {  //server response with sessionkey
        userOrder["sessionKey"] = response['sessionkey'];
        userOrder["transaction_id"] = tran_id;
        await Order.findOneAndUpdate({ userId: userID, "customer.paymentType": "paynow" }, userOrder);
        // await Order.findOneAndUpdate({ userId: userID, "customer.paymentType": "paynow" }, userOrder);
        return res.status(200).send(response);
    }
    return res.status(400).send(response.failedreason);

}

module.exports.paymentSuccess = async (req, res) => {
    res.sendFile(path.join(__basedir, "public/success.html"));
}

module.exports.paymentFailed = async (req, res) => {
    res.sendFile(path.join(__basedir, "public/failed.html"));
}

module.exports.paymentCanceled = async (req, res) => {
    res.sendFile(path.join(__basedir, "public/cancel.html"));
}