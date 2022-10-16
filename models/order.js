const { Schema, model } = require('mongoose');

const orderSchema = {
    userId: Schema.Types.ObjectId,
    ingredients: [
        {
            type: { type: String },
            amount: Number
        }
    ],
    customer: {
        deliveryAddress: String,
        phone: String,
        paymentType: String,
    },
    price: Number,
    orderTime: {
        type: Date,
        default: Date.now,
    },
};

const Order = new model("Order", orderSchema);
module.exports.Order = Order;