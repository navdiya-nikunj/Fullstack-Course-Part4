const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

loginRouter.post('/', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username });
        // console.log(user);
        const passcorrect = user === null ? false : bcrypt.compareSync(password, user.hashedPassword);
        if (!(user && passcorrect)) {
            res.status(401).json({
                error: 'invalid username or password'
            })
        }

        const userForToken = {
            username: user.username,
            id: user._id
        }
        const token = await jwt.sign(userForToken, process.env.SECRET)
        res.status(200).json({
            token, username: user.username, name: user.name
        })
    } catch (e) {
        next(e);
    }
})

module.exports = loginRouter;