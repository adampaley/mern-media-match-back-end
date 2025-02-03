// import
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const verifyToken = require('../middleware/verify-token')
const { Product, Review } = require('../models/product')
const { User } = require('../models/user')
const { ObjectId } = require('bson')

// review routes

// index reviews for a specific product
// GET /reviews

// This is good code if we want to see all reviews for a specific game
// router.get('/', verifyToken, async (req, res) => {
//     try {
//         const products = await Product.findById(req.headers.productid).populate('reviews.author', 'username')

//         if (!products || products.reviews.length === 0) {
//             return res.status(404).json({ err: 'No reviews found.'})
//         }

//         res.status(200).json(products.reviews)
//     } catch (err) {
//         res.status(500).json({ err: err.message })
//     }
// })

// GET /reviews
router.get('/', verifyToken, async (req, res) => {
    try {
        const products = await Product.findById(req.headers.productid).populate('reviews.author', 'username')

        if (!products || products.reviews.length === 0) {
            return res.status(404).json({ err: 'No reviews found.'})
        }

        const userReview = products.reviews.find(review => review.author._id.toString() === req.user._id);

        if (!userReview) {
            return res.status(404).json({ err: 'No review found for this user.' })
        }

        res.status(200).json({ text: userReview.text, author: userReview.author.username})
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})


// submit a review
// POST /reviews
router.post('/', verifyToken, async (req, res) => {
    try {
        const product = await Product.findById(req.body.productId)
        if (!product) {
            return res.status(404).json({ err: 'Product not found.' })
        }

        const owner = new ObjectId(req.user._id)

        if (!product.owners.includes(owner)) {
            return res.status(403).json({ err: "Need to purchase item." })
        }

        const existingReview = product.reviews.find(review => review.author.toString() === req.user._id)
        if (existingReview) {
            return res.status(409).json({ err: "Already reviewed."})
        }

        const review = new Review({
            text: req.body.text,
            author: req.user._id,
        })

        product.reviews.push(review)
        await product.save()

        res.status(201).json({ review })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// see your review
// GET /reviews/:reviewId
// router.get('/:reviewId', verifyToken, async (req, res) => {
//     try {
//         const product = await Product.findById(req.headers.productid)

//         if (!product) {
//             return res.status(404).json({ err: 'Product not found.'})
//         }

//         const review = product.reviews.find(review => review._id.toString() === req.params.reviewId)
        
//         if (!review) {
//             return res.status(404).json({ err: 'Review not found.'})
//         }

//         if (review.author.toString() !== req.user._id) {
//             return res.status(403).json({ err: 'You did not write this.'})
//         }

//         res.status(200).json({ review })
//     } catch (err) {
//         res.status(500).json({ err: err.message })
//     }
// })

// edit your review
// PUT /reviews/:reviewId
router.put('/:reviewId', verifyToken, async (req, res) => {
    try {
        const product = await Product.findById(req.body.productId)

        if (!product) {
            return res.status(404).json({ err: 'Product not found.' })
        }

        const review = product.reviews.find(review => review._id.toString() === req.params.reviewId)
        if (!review || review.author._id.toString() !== req.user._id) {
            return res.status(404).json({ err: 'No review found or not the author.'})
        }

        review.text = req.body.text || review.text

        await product.save()
        res.status(200).json({ review })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// delete your review
// DELETE /:reviewId
router.delete('/:reviewId', verifyToken, async (req, res) => {
    try {
        const product = await Product.findById(req.headers.productid)
        
        if (!product) {
            return res.status(404).json({ err: 'Product not found.' })
        }

        const review = product.reviews.find(review => review._id.toString() === req.params.reviewId)

        if (!review || review.author._id.toString() !== req.user._id) {
            return res.status(404).json({ err: 'No review found or not the author.'})
        }
        product.reviews.remove({ _id: req.params.reviewId })
        await product.save()
        res.status(200).json({ message: "Review deleted." })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// export
module.exports = router