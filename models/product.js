// imports
const mongoose = require('mongoose')

// review schema 
const reviewSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    starRating: {
        type: Number,
        min: 0,
        max: 5
    },
    likedByUsers: {
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'User'
    },
    dislikedByUsers: {
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'User'
    }
    },
    { timestamps: true} 
)

// product schema
const productSchema = new mongoose.Schema({
    id: Number,
    media: {
        type: String,
        enum: ['Books', 'Music', 'Movies', 'TV', 'VideoGames']
    },
    title: String,
    genres: [Object],
    summary: String,
    storyline: String,
    parentalRating: String,
    cover: String,
    releaseDate: Date,
    totalRating: Number,
    owners: {
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'User'
    },
    reviews: [reviewSchema],
})

// register
const Product = mongoose.model('Product', productSchema)
const Review = mongoose.model('Review', reviewSchema)

// export

module.exports = { Product, Review }