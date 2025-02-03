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

        if (!req.headers.userid) {
            return res.status(404).json({ err: 'No user information.'})
        }

        const allUserProducts = await Product.find({ owners: req.headers.userid })

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
            cover: req.body.cart.cover || null,
            genres: req.body.cart.genres || [],
            id: req.body.cart.id,
            media: req.body.cart.media,
            owners: user._id,
            parentalRating: req.body.cart.parentalRating || null,
            releaseDate: req.body.cart.releaseDate || null,
            storyline: req.body.cart.storyline || null,
            summary: req.body.cart.summary || null, 
            title: req.body.cart.title || "Untitled",
            totalRating: req.body.cart.totalRating || null,
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

// export
module.exports = router