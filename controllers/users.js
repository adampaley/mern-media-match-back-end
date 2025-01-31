// import
const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verify-token')
const { User, Setting } = require('../models/user')

// routes
// index all users
// GET /users
router.get('/', async (req, res) => {
    try {
        // Get a list of all users, but only return their username and _id
        const users = await User.find({}, "username")

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

// settings routes
// find existing user settings
// GET /users/:userId/settings
router.get('/:userId/settings', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.params.userId) {
            return res.status(403).json({ err: "Unauthorized" })
        }        

        const user = await User.findById(req.params.userId)

        if (!user) {
            return res.status(404).json({ err: 'User not found.' })
        }

        const savedSettings = user.settings || []

        res.status(200).json({ settings: savedSettings })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// create settings if none have previously been saved
// POST /users/:userId/settings
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

        res.status(200).json({ settings: user.settings })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// update existing settings
// PUT /users/:userId/settings
router.put('/:userId/settings', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.params.userId) {
            return res.status(403).json({ err: "Unauthorized" })
        }      

        const user = await User.findById(req.params.userId)

        if (!user) {
            return res.status(404).json({ err: 'User not found.' })
        }

        if (user.settings.length === 0) {
            return res.status(400).json({ err: "No settings to update. Please use the POST route to create settings."})
        }

        const updatedSetting = user.settings[0]

        updatedSetting.media = req.body.media || updatedSetting.media
        updatedSetting.genre = req.body.genre || updatedSetting.media
        updatedSetting.earliestRelease = req.body.earliestRelease || updatedSetting.earliestRelease
        updatedSetting.latestRelease = req.body.latestRelease || updatedSetting.latestRelease

        await user.save()

        res.status(200).json({ settings: user.settings })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// export
module.exports = router