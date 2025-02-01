// import

const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verify-token')
const { Cart, Setting, User } = require('../models/user')

// routes
// index all users
// GET /users
router.get('/', async (req, res) => {
    try {
        // Get a list of all users, but only return their username and _id
        const users = await User.find({}, "username")

        if (!users) {
            return res.status(404).json({ err: 'No users found.' })
        }

        res.json(users)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// pulls individual user information
// GET /users/:userId
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.params.userId) {
            return res.status(403).json({ err: "Unauthorized" })
        }

        const user = await User.findById(req.params.userId)

        if (!user) {
            return res.status(404).json({ err: 'User not found.' })
        }

        res.status(200).json({ user })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// export
module.exports = router