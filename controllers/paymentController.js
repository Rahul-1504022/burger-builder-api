const path = require('path');
const sslCommerz = require('ssl-commerz-node');
const PaymentSession = sslCommerz.PaymentSession;

module.exports.initPayment = async (req, res) => {
    const userID = req.user._id;
    const tran_id = '_' + Math.random().toString(36).substr(2, 9) + (new Date()).getTime();

    const payment = new PaymentSession(
        true,
        process.env.STORE_ID,
        process.env.STORE_PASSWORD
    );

    // Set the urls
    payment.setUrls({
        success: "", // If payment Succeed
        fail: "", // If payment failed
        cancel: "", // If user cancel payment
        ipn: "", // SSLCommerz will send http post request in this link
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
        name: req.user.name,
        email: req.user.email,
        add1: address1,
        add2: address2,
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
        num_item: total_item,
        name: req.user.name,
        add1: address1,
        add2: address2,
        city: city,
        state: state,
        postcode: postcode,
        country: country,
    });

    // Set Product Profile
    payment.setProductInfo({
        product_name: "Bohubrihi E-com",
        product_category: "General",
        product_profile: "general",
    });
    let response = await payment.paymentInit(); //initiate payment
    let order = new Order({ cartItems: cartItems, user: userID, transaction_id: tran_id, address: profile });

    if (response.status === "SUCCESS") {  //server response with sessionkey
        order['sessionKey'] = response['sessionkey'];
        await order.save();
    }
    return res.status(200).send(response);

}