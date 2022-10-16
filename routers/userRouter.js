const express = require('express');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const router = express.Router();
const _ = require('lodash');

//functionv for signup
const newUser = async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send("User already registered!")
    }
    user = new User(_.pick(req.body, ['email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    //generate token
    const token = user.generateJWT();
    const result = await user.save();
    return res.status(201).send({
        token: token,
        user: _.pick(result, ['_id', 'email']),
    });
}

//function for login
const authUser = async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).send("Invalid email or password!")
    }
    const validUser = await bcrypt.compare(req.body.password, user.password);
    if (!validUser) {
        return res.status(400).send("Invalid email or password!")
    }
    const token = user.generateJWT();
    res.status(201).send({
        token: token,
        user: _.pick(user, ['_id', 'email']),
    })
}


//route
router.route('/')
    .post(newUser)

router.route('/auth')
    .post(authUser)

module.exports = router;