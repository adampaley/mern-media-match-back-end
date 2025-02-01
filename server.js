// imports
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const logger = require('morgan')
const cors = require('cors')

const apiRouter = require('./controllers/api.js')
const authRouter = require('./controllers/auth.js')
// const settingRouter = require('./controllers/settings.js')
// const testJwtRouter = require('./controllers/test-jwt.js')
const userRouter = require('./controllers/users.js')

// connect to DB
mongoose.connect(process.env.MONGODB_URI)

// check connection
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

// universal middleware
app.use(express.json())
app.use(logger('dev'))
app.use(cors())

// controllers
app.use('/api', apiRouter)
app.use('/auth', authRouter)
// app.use('/test-jwt', testJwtRouter)
app.use('/users', userRouter)
// app.use('/users/:userId/settings', settingRouter)

// listeners
app.listen(3000, () => {
  console.log('The express app is ready!')
})