// import
const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verify-token')
const { User, Setting } = require('../models/user')

// authenticated `/user` routes will go here. 

// index all users
router.get('/', async (req, res) => {
    try {
        // Get a list of all users, but only return their username and _id
        const users = await User.find({}, "username")

        res.json(users)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// pulls user entry from User db
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.params.userId) {
            return res.status(403).json({ err: "Unauthorized" })
        }

        const user = await User.findById(req.params.userId)

        if (!user) {
            return res.status(404).json({ err: 'User not found.' })
        }

        res.json({ user })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// settings routes
router.post('/:userId/settings', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.params.userId) {
            return res.status(403).json({ err: "Unauthorized" })
        }        
        
        const newSetting = new Setting(req.body)
        const user = await User.findById(req.params.userId)

        if (!user) {
            return res.status(404).json({ err: 'User not found.' })
        }

        if (user.settings.length > 0) {
            return res.status(400).json({ err: "User already has settings. Please update using the PUT route."})
        }

        user.settings.push(newSetting)
        await user.save()

        res.json({ settings: user.settings })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// export
module.exports = router; 