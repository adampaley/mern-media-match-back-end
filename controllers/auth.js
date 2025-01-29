const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.js');

const saltRounds = 10;

router.post('/sign-up', async (req, res) => {
    try {
        const userInDatabase = await User.User.findOne({ username: req.body.username });

        if (userInDatabase) {
            return res.status(409).json({ err: 'Invalid Sign Up Information'});
        }

        const user = await User.User.create({
            username: req.body.username,
            hashedPassword: bcrypt.hashSync(req.body.password, saltRounds)
        });

        const payload = { username: user.username, _id: user._id };

        const token = jwt.sign({ payload }, process.env.JWT_SECRET);

        res.status(201).json({ token });
    } catch (err) {
        res.status(400).json({ err: err.message });
    }
});

module.exports = router;