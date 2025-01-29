// import
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.js');

const saltRounds = 10;
// routes
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

router.post('/sign-in', async (req, res) => {
    try {
        const user = await User.User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(401).json({ err: 'Invalid Credentials' });
        }

        const checkPassword = bcrypt.compareSync(req.body.password, user.hashedPassword);

        if (!checkPassword) {
            return res.status(401).json({ err: 'Invalid Credentials' });
        }

        const payload = { username: user.username, _id: user._id };

        const token = jwt.sign({ payload }, process.env.JWT_SECRET);

        res.status(200).json({ token });
    } catch (err) {
        res.status(400).json({ err: err.message });
    }
});

// export
module.exports = router;