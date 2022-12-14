const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    ingredients: [
        {
            type: { type: String },
            amount: Number
        }
    ],
    customer: {
        name: String,
        email: String,
        city: String,
        postcode: String,
        country: String,
        address: String,
        phone: String,
        state: String,
        paymentType: String,
    },
    totalPrice: Number,
    orderTime: {
        type: Date,
        default: Date.now,
    },
    sessionKey: String,
    transaction_id: String,
}, { timestamps: true });

const Order = new model("Order", orderSchema);
module.exports.Order = Order;