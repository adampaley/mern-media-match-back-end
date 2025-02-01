// import

const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verify-token')
const { Product, Review } = require('../models/product')
const { User } = require('../models/user')

// product routes
// index all items stored in product database
// GET /
router.get('/', async (req, res) => {
    try {
        // Get a list of all users, but only return their username and _id
        const allPurchasedProducts = await Product.find()

        if (allPurchasedProducts.length === 0) {
            return res.status(404).json({ err: 'No products found.' })
        }

        res.json(allPurchasedProducts)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// add items to products database
// POST /

router.post('/', async (req, res) => {
    try {
        const productInDatabase = await Product.findOne({ id: req.body.cart.id })

        if (productInDatabase) {
            return res.status(409).json({ err: 'Product Already in Database' })
        }

        const product = await Product.create({
            id: req.body.cart.id,
            media: req.body.cart.media,
        })



    } catch (err) {
        res.status(500).json({ err: err.message })        
    }
})


// review routes


// export
module.exports = router