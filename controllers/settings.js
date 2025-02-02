// import
const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verify-token')
const { User, Setting } = require('../models/user')

// settings routes
// find existing user settings
// GET /settings
router.get('/', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.headers.userid) { // all keys in headers automitcally made lowercase
            return res.status(403).json({ err: "Unauthorized." })
        }        

        const user = await User.findById(req.headers.userid)

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
// POST /settings
router.post('/', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.body.userId) {
            return res.status(403).json({ err: "Unauthorized." })
        }        

        const user = await User.findById(req.body.userId)

        if (!user) {
            return res.status(404).json({ err: 'User not found.' })
        }

        if (user.settings.length > 0) {
            return res.status(409).json({ err: "User already has settings. Please update using the PUT route."})
        }
    
        const newSetting = new Setting(req.body.settings)
        user.settings.push(newSetting)
        await user.save()

        res.status(200).json({ settings: user.settings })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// update existing settings
// PUT /settings
router.put('/', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.body.userId) {
            return res.status(403).json({ err: "Unauthorized." })
        }      

        const user = await User.findById(req.body.userId)
        if (!user) {
            return res.status(404).json({ err: 'User not found.' })
        }

        if (user.settings.length === 0) {
            return res.status(400).json({ err: "No settings to update. Please use the POST route to create settings."})
        }

        const updatedSetting = user.settings[0]

        updatedSetting.media = req.body.settings.media || updatedSetting.media
        updatedSetting.genre = req.body.settings.genre || updatedSetting.media
        updatedSetting.earliestRelease = req.body.settings.earliestRelease || updatedSetting.earliestRelease
        updatedSetting.latestRelease = req.body.settings.latestRelease || updatedSetting.latestRelease

        await user.save()

        res.status(200).json({ settings: user.settings })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// export
module.exports = router