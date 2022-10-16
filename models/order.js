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
        deliveryAddress: String,
        phone: String,
        paymentType: String,
    },
    totalPrice: Number,
    orderTime: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Order = new model("Order", orderSchema);
module.exports.Order = Order;