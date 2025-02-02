// import
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const verifyToken = require('../middleware/verify-token')
const { Product, Review } = require('../models/product')
const { User } = require('../models/user')
const { ObjectId } = require('bson')

// product routes
// index all items stored in product database
// GET /products
router.get('/', verifyToken, async (req, res) => {
    try {

        if (!req.body.userId) {
            return res.status(404).json({ err: 'No user information.'})
        }

        const allUserProducts = await Product.find({ owners: req.body.userId })

        if (allUserProducts.length === 0) {
            return res.status(404).json({ err: 'No products found.' })
        }

        res.status(200).json(allUserProducts)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// add items to products database
// POST /products
router.post('/', verifyToken, async (req, res) => {
    try {
        if (!req.body.cart) {
            return res.status(404).json({ err: 'Cart not passed.'})
        }

        const existingProduct = await Product.findOne({ id: req.body.cart.id })

        if (existingProduct) {
            return res.status(409).json({ err: 'Product already in database.' })
        }
        const user = await User.findById(req.body.userId)

        const newProduct = new Product({
            id: req.body.cart.id,
            media: req.body.cart.media,
            genres: req.body.cart.genres || [],
            cover: req.body.cart.cover || null,
            summary: req.body.cart.summary || null, 
            storyline: req.body.cart.storyline || null,
            parentalRating: req.body.cart.parentalRating || null,
            cover: req.body.cart.cover || null,
            releaseDate: req.body.cart.releaseDate || null,
            totalRating: req.body.cart.totalRating || null,
            owners: user._id
        })
        await newProduct.save()

        user.library.push(newProduct._id)
        await user.save()

        res.status(200).json({ product: newProduct })
    
    } catch (err) {
        res.status(500).json({ err: err.message })        
    }
})

// update existing product with new owner or remove if owner removes from their library
// PUT /products/:productId
router.put('/:productId', verifyToken, async (req, res) => {
    try {
        if (!req.body.userId) {
            return res.status(400).json({ err: 'User information not provided.'})
        }
        
        const user = await User.findById(req.body.userId)
        const storedProduct = await Product.findById(req.params.productId)
        
        if (!storedProduct) {
            return res.status(404).json({ err: 'Product not found.' })
        }

        if (storedProduct.owners.includes(req.body.userId)) {
            await Product.updateOne(
                { _id: req.params.productId }, 
                { $pull: { owners: req.body.userId } }
            )
            await User.updateOne(
                { _id: req.body.userId }, 
                { $pull: { library: req.params.productId } }
            )
        } else {
            storedProduct.owners.push(req.body.userId)
            await storedProduct.save()
            user.library.push(storedProduct._id)
            await user.save()
        }

        const updatedProduct = await Product.findById(req.params.productId)

        res.status(200).json({ updatedProduct })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// review routes

// index reviews for a specific product
// GET /products/:productId/reviews

// This is good code if we want to see all reviews for a specific game
router.get('/:productId/reviews', verifyToken, async (req, res) => {
    try {
        const products = await Product.findById(req.params.productId).populate('reviews.author', 'username')

        if (!products || products.reviews.length === 0) {
            return res.status(404).json({ err: 'No reviews found.'})
        }

        res.status(200).json(products.reviews)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// submit a review
// POST /products/:productId/reviews
router.post('/:productId/reviews', verifyToken, async (req, res) => {
    try {

        const product = await Product.findById(req.params.productId)
        if (!product) {
            return res.status(404).json({ err: 'Product not found.' })
        }

        const user = User.findById(req.body.userId)

        const owner = new ObjectId(req.body.userId)
        console.log(owner)

        if (!product.owners.includes(owner)) {
            return res.status(403).json({ err: "Need to purchase item." })
        }

        const existingReview = product.reviews.find(review => review.author.toString() === req.body.userId)
        if (existingReview) {
            return res.status(409).json({ err: "Already reviewed."})
        }

        const review = new Review({
            text: req.body.text,
            author: req.body.userId,
        })

        product.reviews.push(review)
        await product.save()

        res.status(201).json({ review })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// see your review
// GET /products/:productId/reviews/:reviewId
router.get('/:productId/reviews/:reviewId', verifyToken, async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId)

        if (!product) {
            return res.status(404).json({ err: 'Product not found.'})
        }

        const review = product.reviews.find(review => review._id.toString() === req.params.reviewId)
        
        if (!review) {
            return res.status(404).json({ err: 'Review not found.'})
        }
        res.status(200).json({ review })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// edit your review
// PUT /products/:productId/reviews/:reviewId
router.put('/:productId/reviews/:reviewId', verifyToken, async (req, res) => {
    try {

    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// delete your review
// DELETE /products/:productId/reviews/:reviewId
router.delete('/:productId/reviews/:reviewId', verifyToken, async (req, res) => {
    try {
        
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// export
module.exports = router