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
        // Get a list of all users, but only return their username and _id
        const allPurchasedProducts = await Product.find()

        if (allPurchasedProducts.length === 0) {
            return res.status(404).json({ err: 'No products found.' })
        }

        res.status(200).json(allPurchasedProducts)
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

        res.status(200).json({ product: newProduct })
        

    } catch (err) {
        res.status(500).json({ err: err.message })        
    }
})

// update existing product with new owner
// PUT /products/:productId
router.put('/:productId', verifyToken, async (req, res) => {
    try {
        if (!req.body.userId) {
            return res.status(400).json({ err: 'User information not provided.'})
        }
        
        const storedProduct = await Product.findById(req.params.productId)

        if (!storedProduct) {
            return res.status(404).json({ err: 'Product not found.' })
        }

        if (storedProduct.owners.includes(req.body.userId)) {
            await Product.updateOne(
                { _id: req.params.productId }, 
                { $pull: { owners: req.body.userId } }
            )
            console.log(storedProduct.owners)
        } else {
            storedProduct.owners.push(req.body.userId)
            await storedProduct.save()
        }

        const updatedProduct = await Product.findById(req.params.productId)

        res.status(200).json({ updatedProduct })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// review routes


// export
module.exports = router