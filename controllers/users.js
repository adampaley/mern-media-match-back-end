// import
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');

const User = require('../models/user');


// authenticated `/user` routes will go here. 

router.get('/', async (req, res) => {
    try {
        // Get a list of all users, but only return their username and _id
        const users = await User.User.find({}, "username");

        res.json(users);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

router.get('/:userId', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.params.userId) {
            return res.status(403).json({ err: "Unauthorized" });
        }

        const user = await User.User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ err: 'User not found.' });
        }

        res.json({ user });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

// export
module.exports = router; 