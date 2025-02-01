// imports
const mongoose = require('mongoose')

// setting schema 
const settingSchema = new mongoose.Schema({
    media: { 
        type: [String], 
        required: true, 
        enum: ['Books', 'Music', 'Movies', 'TV', 'VideoGames']
    },
    genre: {
        type: [String],
    },
    earliestRelease: Date,
    latestRelease: Date,
})

// cart schema
const cartSchema = new mongoose.Schema({
    id: Number,
    media: {
        type: String,
        enum: ['Books', 'Music', 'Movies', 'TV', 'VideoGames']
    },
    title: String,
    genre: [String],
    summary: String,
    storyline: String,
    parentalRating: String,
    image: String,
    releaseDate: Date,
    totalRating: Number,
    price: Number,
})

// user schema 
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        minLength: 5, 
        match: [/^[a-zA-Z0-9_]+$/] // only allows these characters
    },
    hashedPassword: {
        type: String,
        required: true,
        minLength: 6
    },
    settings: [settingSchema],
    cart: [cartSchema],
    library: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

// case-insensitive check on usernames
userSchema.index({ username: 1 }, { collation: { locale: 'en', strength: 2 } })

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword
    }
})

// register
const Cart = mongoose.model('Cart', cartSchema)
const Setting = mongoose.model('Setting', settingSchema)
const User = mongoose.model('User', userSchema)

// exports 
module.exports = { Cart, Setting, User }
