// import
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const verifyToken = require('../middleware/verify-token')
const { Product, Review } = require('../models/product')
const { User } = require('../models/user')

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
router.get('/:productId/reviews', verifyToken, async (req, res) => {
    try {
        const products = await Product.find()

    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// submit a review
// POST /products/:productId/reviews
router.post('/:productId/reviews', verifyToken, async (req, res) => {
    try {
        
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})


// see your review
// GET /products/:productId/reviews/:reviewId
router.get('/:productId/reviews/:reviewId', verifyToken, async (req, res) => {
    try {
        
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