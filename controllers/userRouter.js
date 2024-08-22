const userRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

userRouter.post('/', async (req, res, next) => {
    const body = req.body;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(body.password, salt);
    const newUser = new User({
        name: body.name,
        username: body.username,
        hashedPassword: hash
    })
    try {
        const addeduser = await newUser.save();
        res.send(201).json(addeduser);
    } catch (e) {
        next(e);
    }
})

userRouter.get('/', async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (e) {
        next(e);
    }
})

module.exports = userRouter;