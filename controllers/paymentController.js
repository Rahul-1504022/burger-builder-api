const path = require('path');

module.exports.initPayment = async (req, res) => {
    console.log("HI");
    res.sendFile(path.join(__basedir, "public/success.html"));
}