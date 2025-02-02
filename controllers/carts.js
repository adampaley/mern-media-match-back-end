// import

const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verify-token')
const { Cart, User } = require('../models/user')


// cart routes
// index individual's cart
// GET /carts
router.get('/', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.headers.userid) {
            return res.status(403).json({ err: "Unauthorized" })
        }

        const user = await User.findById(req.headers.userid) 

        if (!user) {
            return res.status(404).json({ err: 'User not found.' })
        }

        const savedCart = user.cart || []

        res.status(200).json({ cart: savedCart })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})



router.post('/', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.body.userId) {
            return res.status(403).json({ err: "Unauthorized" })
        }

        const user = await User.findById(req.body.userId) 

        if (!user) {
            return res.status(404).json({ err: 'User not found.' })
        }
        
        const cartItem = new Cart(req.body.cart)

        const alreadyInCart = user.cart.filter((item) => item.id === cartItem.id)        
        if (alreadyInCart.length > 0) {
            return res.status(409).json({ err: "Item already in cart."})
        }

        user.cart.push(cartItem)
        await user.save()
        
        res.status(200).json({ cart: user.cart})
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

router.delete('/:cartItemId', verifyToken, async (req,res) => {
    try {
        const user = await User.findById(req.headers.userid)
        console.log(user)
        user.cart.remove({ _id: req.params.cartItemId})
        await user.save()
        res.status(200).json({message: 'cart item deleted'})
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// export
module.exports = router 